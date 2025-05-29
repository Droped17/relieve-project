/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bcrypt from 'bcrypt'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Types } from 'mongoose';
import { Booking } from '@/src/models/Booking';
import { Room } from '@/src/models/Room';
import { ITransaction, Transaction } from '@/src/models/Transaction';
import { IUser, User } from '@/src/models/User';
import { sendEmail } from '../../lib/mailer';
import fs from 'fs';
import path from 'path';
import { sendContactEmail } from '../../utils/sendContactEmail';
// import { GraphQLContext } from '../context';
import { CommonResponse, EStatus } from '../commonResponse';


/* For use DD-MM-YYYY format */
dayjs.extend(customParseFormat);

// const requireAuth = (user) => {
//   if (!user) throw new Error("Not Authenticated");
// };

// [TODO]: Remove transaction in 1 hr if status !== PAID 

export const resolvers = {
  Query: {
    /* MARK: PRIVATE */
    // myProfile: (_, args) => {
    //   // if (!context.isAuthenticated) {
    //   //   throw new Error('Authentication required');
    //   // }
    //   // return {
    //   //   id: context.user?.id,
    //   //   name: context.user?.name,
    //   //   email: context.user?.email,
    //   // };
    // },

    /* MARK: ROOM */
    roomStatByDate: async (_: any, { date }: any) => {
      const targetDate = dayjs(date, 'YYYY-MM-DD', true)
      if (!targetDate.isValid()) {
        throw new Error("Invalid date format.")
      }

      const [totalRoom, bookingOnDate] = await Promise.all([
        Room.countDocuments(), // total room,
        Booking.find({
          checkIn: { $lte: targetDate.toDate() },
          checkOut: { $gt: targetDate.toDate() }
        }).lean()
      ])

      const occupiedRoomId = new Set(bookingOnDate.map(b => b.room.toString()))
      const checkInRoomCount = bookingOnDate.filter(b => dayjs(b.checkIn).isSame(targetDate, 'day')).length;

      return {
        date,
        emptyRoomCount: totalRoom - occupiedRoomId.size,
        checkInRoomCount
      }

    },
    /* MARK: BOOKING */
    /* MARK: TRANSACTION */

    /* MARK: PUBLIC */
    // users: async (_, __, context) => {
    //   requireAuth(context.user);
    //   return await User.find();
    // },
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

        const bookedRoomSet = new Set(bookings.map((b) => b.room.toString()));

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
    findTransactionBy: async (
      _: any,
      args: { id?: string; bookingId?: string }
    ): Promise<CommonResponse<ITransaction[]>> => {
      try {
        let transaction = null;

        if (args.id) {
          if (!Types.ObjectId.isValid(args.id)) {
            return {
              status: EStatus.ERROR,
              message: "Invalid transaction ID",
            };
          }

          transaction = await Transaction.findById(args.id).populate("booking");
        } else if (args.bookingId) {
          if (!Types.ObjectId.isValid(args.bookingId)) {
            return {
              status: EStatus.ERROR,
              message: "Invalid booking ID",
            };
          }

          transaction = await Transaction.findOne({ booking: args.bookingId }).populate("booking");
        }

        if (!transaction) {
          return {
            status: EStatus.ERROR,
            message: "Transaction not found",
          };
        }

        return {
          status: EStatus.SUCCESS,
          message: "Transaction found",
          data: transaction,
        };
      } catch (err: any) {
        return {
          status: EStatus.ERROR,
          message: err.message || "Failed to fetch transaction",
        };
      }
    },

    findTransactionByStatus: async (
      _: any,
      args: { status?: string }
    ): Promise<CommonResponse<ITransaction[]>> => {

      try {
        const filter: any = {}

        if (args.status) {
          filter.status = args.status
        }

        /* room in booking */
        const transactions = await Transaction.find(filter).populate({
          path: 'booking',
          populate: {
            path: 'room',
            /* query only usage data */
            select: ['floor', 'number']
          }
        })

        if (!transactions.length) {
          return {
            status: EStatus.ERROR,
            message: "No transactions found",
          };
        }

        return {
          status: EStatus.SUCCESS,
          message: "Transactions fetched",
          data: transactions,
        };
      } catch (err: any) {
        return {
          status: EStatus.ERROR,
          message: err.message || "Failed to fetch transactions",
        };
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
      return await Transaction.find().populate('user').populate('booking')
    },
    allRooms: async (_: any, { date, nights, personPerRoom, floor }: any) => {
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
    },
  },
  Mutation: {
    /* USER, ADMIN */
    createUser: async (_: never, args: IUser) => {
      // if (!context.isAdmin) {
      //   throw new Error('Not Authorization');
      // }
      const newUser = await User.create({
        ...args,
        password: await bcrypt.hash(args.password, 10)
      })
      return newUser
    },
    /* ADMIN */
    createRoom: async (_: any, { input }: any) => {

      // if (!context.isAdmin) {
      //   throw new Error('Not Authorization');
      // }

      const { number, detail, price, floor, image, personPerRoom } = input;
      const newRoom = await Room.create({
        number,
        detail,
        price,
        floor,
        image,
        personPerRoom
      })
      return newRoom
    },
    /* USER, ADMIN */
    createTransaction: async (_: never, args: ITransaction) => {
      const newRoom = await Transaction.create({
        ...args,
      })
      return newRoom
    },
    /* USER, ADMIN */
    /* [TODO]: Fix request input */
    createBooking: async (_: any, { input }: any) => {
      const { roomId, checkIn, nights, personPerRoom, guest, request } = input;

      const parsedCheckIn = dayjs(checkIn, 'YYYY-MM-DD', true);
      const parsedCheckOut = parsedCheckIn.add(nights, 'day')

      if (!parsedCheckIn.isValid()) {
        throw new Error("Invalid date format. Use YYYY-MM-DD.");
      }

      /* Check exists booking */
      const isBooked = await Booking.exists({
        room: roomId,
        checkIn: parsedCheckIn
      });

      if (isBooked) {
        throw new Error("This room is already booked.");
      }

      const booking = await Booking.create({
        room: roomId,
        checkIn: parsedCheckIn.toDate(),
        checkOut: parsedCheckOut.toDate(),
        personPerRoom,
        nights,
        request,
        guest
      });

      const result = await Room.findByIdAndUpdate(roomId, {
        $push: { booking: booking._id }
      });

      if (result) {
        const room = await Room.findById(roomId)

        /* Create Transaction */
        const newTransaction = await Transaction.create({
          booking: booking._id,
          totalPrice: room.price * nights,
        })

        if (newTransaction) {
          // FOR DEV
          await sendContactEmail({
            to: guest.email,
            subject: 'Booking Confirmation',
            username: guest.firstName,
            actionUrl: `http://localhost:3000/th/transaction`,
            transactionId: newTransaction._id
          })
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
    confirmTransaction: async (_: any, { id }: { id: string }) => {
      const result = await Transaction.updateOne({
        _id: id
      },
        {
          $set: {
            status: "SUCCESS"
          }
        }
      )
      return result.modifiedCount > 0;
    },
    /* USER, ADMIN */
    uploadImage: async (_: any, { imageUrl, transactionId }: { imageUrl: string; transactionId: string }) => {
      const result = await Transaction.updateOne(
        { _id: transactionId },             // filter
        {
          $set: {                           // update
            image: imageUrl,
          }
        }
      );
      return result.modifiedCount > 0;
    },
  }
};
