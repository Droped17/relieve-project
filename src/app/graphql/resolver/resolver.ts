/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bcrypt from 'bcrypt'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Types } from 'mongoose';
import { Booking } from '@/src/models/Booking';
import { Room } from '@/src/models/Room';
import { ITransaction, Transaction } from '@/src/models/Transaction';
import { User } from '@/src/models/User';
import { sendEmail } from '../../lib/mailer';
import fs from 'fs';
import path from 'path';
import { sendContactEmail } from '../../utils/sendContactEmail';
import { GraphQLContext } from '../context';
import { CommonResponse, EStatus } from '../commonResponse';
import { ObjectId } from 'mongodb';


/* For use DD-MM-YYYY format */
dayjs.extend(customParseFormat);

// [TODO]: Remove transaction in 1 hr if status !== PAID 

export const resolvers = {
  Query: {
    myProfile: (_: any, context: GraphQLContext) => {
      if (!context.isAuthenticated && !context.isAdmin()) {
        throw new Error('Not Authorization');
      }
      return {
        id: context.user?.id,
        name: context.user?.name,
        email: context.user?.email,
      };
    },

    /* MARK: ROOM */
    // ADMIN
    roomStatByDate: async (_: any, { date }: any, context: GraphQLContext) => {
      if (!context.isAuthenticated && !context.isAdmin()) {
        throw new Error('Not Authorization');
      }
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
    findRoomBy: async (
      _: unknown, { input }: any
    ) => {
      const { id, floor, status, date, nights, numberOfPeople } = input
      const filter: any = {};

      if (id) filter._id = new ObjectId(id);
      if (floor !== undefined) filter.floor = floor;
      if (status !== undefined) filter.status = status;
      
      const allRooms = await Room.find(filter);

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
    countEmptyRooms: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.isAuthenticated && !context.isAdmin()) {
        throw new Error('Not Authorized');
      }
      // Get All Rooms
      const allRooms = await Room.countDocuments()
      // Get Bookings
      const bookingNumber = await Booking.countDocuments()
      // Caculate empty rooms
      const emptyRoom = allRooms - bookingNumber

      return emptyRoom;
    },
    findRoomByStatus: async (_: unknown, { input }: any, context: GraphQLContext) => {
      if (!context.isAuthenticated && !context.isAdmin()) {
        throw new Error('Not Authorization');
      }
      try {
        const { id, status } = input

        const filter: any = {}
        if (id) filter._id = id
        if (status) filter.status = status

        const rooms = await Room.find(filter)

        return rooms

      } catch (error) {
        console.error(error)
      }
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
    isCheckedIn: async (_: any, { date }: any, context: GraphQLContext) => {
      if (!context.isAuthenticated && !context.isAdmin()) {
        throw new Error('Not Authorized');
      }
      const checkIn = dayjs(date, 'YYYY-MM-DD', true);

      if (!checkIn.isValid()) {
        throw new Error("Invalid date format. Use DD-MM-YYYY.");
      }

      const checkInDate = await Transaction.find({
        checkIn: checkIn.toDate()
      })

      /* Total Checkin */
      const totalCheckIn = await Transaction.countDocuments({
        checkIn: checkIn.toDate()
      })

      /* Pending Checkin */
      const result = [];
      for (const pendingCheckIn of checkInDate) {
        result.push(pendingCheckIn.checkedInAt)
      }

      const pendingCheckIn = result.filter((item) => item !== null)

      return {
        status: EStatus.SUCCESS,
        message: "Get Checked in success",
        data: {
          totalCheckIn,
          pendingCheckIn: pendingCheckIn.length
        }
      }
    },
    totalCustomer: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.isAuthenticated && !context.isAdmin()) {
        throw new Error('Not Authorized');
      }
      /* Get User */
      const totalUsers = await User.countDocuments()
      /* Get Total Room */
      const totalRooms = await Room.countDocuments()
      /* Get Total Income */
      const totalIncome = await Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalPrice: { $sum: "$totalPrice" }
          }
        }
      ])

      return {
        status: EStatus.SUCCESS,
        message: "Get Total Customer",
        data: {
          totalUsers,
          totalRooms,
          totalIncome: totalIncome[0].totalPrice
        }
      }
    },
    incomePerMonth: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.isAuthenticated && !context.isAdmin()) {
        throw new Error('Not Authorized');
      }

      const currentYear = dayjs().year();

      const incomeByMonth = await Transaction.aggregate([
        {
          $match: {
            checkIn: {
              $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
              $lte: new Date(`${currentYear}-12-31T23:59:59Z`)
            }
          }
        },
        {
          $group: {
            _id: { $month: "$checkIn" },
            totalIncome: { $sum: "$totalPrice" }
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalIncome: 1
          }
        },
        {
          $sort: { month: 1 }
        }
      ]);

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const result = Array.from({ length: 12 }, (_, i) => {
        const found = incomeByMonth.find(m => m.month === i + 1);
        return {
            month: monthNames[i],
            totalIncome: found ? found.totalIncome : 0
        };
      });

      return {
        status: EStatus.SUCCESS,
        message: "Get Income Per Month",
        data: result
      };
    },
  },
  Mutation: {
    /* USER, ADMIN */
    createUser: async (_: never, { input }: any) => {
      const newUser = await User.create({
        ...input,
        password: await bcrypt.hash(input.password, 10)
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
    deleteTransaction: async (_:any, {id}: {id: string}, context: GraphQLContext) => {
      if (!context.isAdmin()) {
        throw new Error('Not Authorization');
      }

      const result = await Transaction.deleteOne({
        _id: id
      })

      if (result) {
        return {
          status: EStatus.SUCCESS,
          message: "Delete Transaction Success"
        }
      } else {
        return {
          status: EStatus.ERROR,
          message: "Error to delete Transaction"
        }
      }

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
          checkIn: parsedCheckIn.toDate(),
          checkOut: parsedCheckOut.toDate(),
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
    sendContactEmail: async (_: any, { input }: any) => {
      const { to, subject, username, actionUrl } = input
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
          username,
          actionUrl
        });

        await sendEmail({
          to,
          subject,
          html
        });

        return { success: true, message: 'Email Sent Successfully!' };
      } catch (error) {
        console.error('Email error:', error);
        return { success: false, message: 'Failed to send email' };
      }
    },
    /* ADMIN */
    confirmTransaction: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.isAdmin()) {
        throw new Error('Not Authorization');
      }
      const result = await Transaction.updateOne({
        _id: id
      },
        {
          $set: {
            status: "PAID"
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
