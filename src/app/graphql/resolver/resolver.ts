import * as bcrypt from 'bcrypt'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Types } from 'mongoose';
import { Booking } from '@/src/models/Booking';
import { IRoom, Room } from '@/src/models/Room';
import { ITransaction, Transaction } from '@/src/models/Transaction';
import { IUser, User } from '@/src/models/User';
import { sendEmail } from '../../lib/mailer';
import fs from 'fs';
import path from 'path';
import { sendContactEmail } from '../../utils/sendContactEmail';
import { GraphQLContext } from '../context';


/* For use DD-MM-YYYY format */
dayjs.extend(customParseFormat);

const requireAuth = (user) => {
  if (!user) throw new Error("Not Authenticated");
};

// [TODO]: Remove transaction in 1 hr if status !== PAID 

export const resolvers = {
  Query: {
    /* MARK: PRIVATE */
    myProfile: (_, args, context: GraphQLContext) => {
      if (!context.isAuthenticated) {
        throw new Error('Authentication required');
      }
      return {
        id: context.user?.id,
        name: context.user?.name,
        email: context.user?.email,
      };
    },


    /* MARK: PUBLIC */
    users: async (_, __, context) => {
      requireAuth(context.user);
      return await User.find();
    },
    findRoomBy: async (
      _: unknown,
      args: {
        id?: string;
        floor?: number;
        status?: string;
        date?: string;
        nights?: number;
        numberOfPeople?: number;
        context?: any
      }
    ) => {
      const filter: any = {};

      if (args.id) filter._id = new Types.ObjectId(args.id);
      if (args.floor !== undefined) filter.floor = args.floor;
      if (args.status !== undefined) filter.status = args.status;

      const allRooms = await Room.find(filter);

      // console.log(allRooms);

      const { date, nights, numberOfPeople } = args;

      if (date && nights && numberOfPeople) {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + nights);

        const bookings = await Booking.find({
          status: { $ne: 'CANCELLED' },
          $or: [
            {
              dateEnd: { $gte: startDate },
              createdAt: { $lte: endDate },
            },
          ],
        }).select('room');

        // console.log(bookings);

        const bookedRoomSet = new Set(bookings.map((b) => b.room.toString()));

        // console.log(bookedRoomSet);

        return allRooms.map((room) => {
          let status: 'FULL' | 'EMPTY' | 'UNVAILABLE';

          if (room.personPerRoom < numberOfPeople) {
            status = 'UNVAILABLE';
          } else if (bookedRoomSet.has(room._id.toString())) {
            status = 'FULL';
          } else {
            status = 'EMPTY';
          }

          return {
            ...room.toObject(),
            status,
          };
        })
      }
      // Return rooms without availability if date filters are missing 
      return allRooms.map((room) => ({
        ...room.toObject(),
      }));
    },
    findTransactionBy: async (_, args: { id?: string, bookingId?: string }) => {
      const filter: any = {};
      if (args.id) filter._id = new Types.ObjectId(args.id);

      const transaction = await Transaction.findById(args.id).populate('booking')
      if (transaction) {
        return [transaction]
      } else {
        return []
      }
    },
    booking: async () => {
      // populate User and Room
      return await Booking.find().populate('user').populate('room')
    },
    /* ADMIN */
    rooms: async () => {
      return await Room.find()
    },
    /* ADMIN */
    transaction: async () => {
      return await Transaction.find()
    },
    allRooms: async (_, { date, nights, personPerRoom, floor }) => {
      // Use dayjs to parse input date and add nights
      const checkIn = dayjs(date, 'YYYY-MM-DD', true); // or 'DD-MM-YYYY' if needed
      if (!checkIn.isValid()) {
        throw new Error("Invalid date format. Use DD-MM-YYYY.");
      }

      const checkOut = checkIn.add(nights, 'day');

      const roomQuery = floor ? { floor } : {};

      const rooms = await Room.find(roomQuery).populate({
        path: 'booking',
        match: {
          checkIn: { $lt: checkOut.toDate() },
          checkOut: { $gt: checkIn.toDate() },
        },
      }).lean();

      return rooms.map(room => ({
        ...room,
        isBooked:
          (Array.isArray(room.booking) && room.booking.length > 0) ||
          room.personPerRoom < personPerRoom,
      }));
    }

  },
  Mutation: {
    /* USER, ADMIN */
    createUser: async (_: never, args: IUser, context: GraphQLContext) => {
      const newUser = await User.create({
        ...args,
        password: await bcrypt.hash(args.password, 10)
      })
      return newUser
    },
    /* ADMIN */
    createRoom: async (_: never, args: IRoom, context: GraphQLContext) => {
      if (!context.isAdmin) {
         throw new Error('Not Authorization');
      }
      const newRoom = await Room.create({
        ...args,
      })
      return newRoom
    },
    /* USER, ADMIN */
    createTransaction: async (_: never, args: ITransaction) => {
      const newRoom = await Transaction.create({
        ...args,
      })
      console.log(newRoom);
      return newRoom
    },
    /* USER, ADMIN */
    createBooking: async (_, { input }) => {
      const { roomId, checkIn, nights, personPerRoom, guest } = input;

      const parsedCheckIn = dayjs(checkIn, 'YYYY-MM-DD', true);

      if (!parsedCheckIn.isValid()) {
        throw new Error("Invalid date format. Use YYYY-MM-DD.");
      }

      const parsedCheckOut = parsedCheckIn.add(nights, 'day')

      /* [TODO]: handle User and Guest */
      /* [TODO]: handle logic for check booked */
      const booking = await Booking.create({
        room: roomId,
        checkIn: parsedCheckIn.toDate(),
        checkOut: parsedCheckOut.toDate(),
        personPerRoom,
        nights,
        // user: req.user._id  <-- if required, pass this from auth 
        guest
      });

      const result = await Room.findByIdAndUpdate(roomId, {
        $push: { booking: booking._id }
      });

      if (result) {

        // FOR DEV
        // await sendContactEmail({
        //   to: guest.email,
        //   subject: 'Booking Confirmation',
        //   username: guest.firstName,
        //   actionUrl: `http://localhost:3000/th/transaction`
        // })

        const room = await Room.findById(roomId)
        console.log(room.price);

        const newTransaction = await Transaction.create({
          booking: booking._id,
          totalPrice: room.price * nights,
        })

        if (newTransaction) {
          return booking
        }
      }
    },
    /* USER */
    // MARK: MAILER
    sendContactEmail: async (_: any, args: {
      to: string;
      subject: string;
      message: string;
      username: string;
      actionUrl: string;
    }) => {
      try {
        const getEmailTemplate = (templateName: string, variables: Record<string, string>) => {
          const filePath = path.join(process.cwd(), '/src/app/emailTemplates', `${templateName}.html`);
          let template = fs.readFileSync(filePath, 'utf8');

          for (const key in variables) {
            const value = variables[key];
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, value);
          }

          return template;
        }

        const html = getEmailTemplate('booking', {
          username: args.username,
          actionUrl: args.actionUrl
        });

        await sendEmail({
          to: args.to,
          subject: args.subject,
          html
        });

        return { success: true, message: 'Email Sent Successfully!' };
      } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: 'Failed to send email' };
      }
    },
    /* USER, ADMIN */
    uploadImage: async (_: any, { imageUrl, transactionId }: { imageUrl: string; transactionId: string }) => {
      console.log("Image uploaded to:", imageUrl);

      const result = await Transaction.updateOne(
        { _id: transactionId },             // filter
        {
          $set: {                           // update
            image: imageUrl,
            status: "PAID"                    // [TODO]: status "PAID" will confirm by Admin
          }
        }
      );

      console.log("Update result:", result);
      return result.modifiedCount > 0;
    }
  }
};
