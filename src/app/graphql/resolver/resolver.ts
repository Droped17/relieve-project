import * as bcrypt from 'bcrypt'
import { Booking } from '@/src/models/Booking';
import { IRoom, Room } from '@/src/models/Room';
import { ITransaction, Transaction } from '@/src/models/Transaction';
import { IUser, User } from '@/src/models/User';
import { Types } from 'mongoose';

export const resolvers = {
  Query: {
    users: async () => {
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
    booking: async () => {
      // populate User and Room
      return await Booking.find().populate('user').populate('room')
    },
    rooms: async () => {
      return await Room.find()
    },
    allRooms: async (_, { date, nights, personPerRoom, floor }) => {
      /* [TODO]: use moment for handle date */
      const checkIn = new Date(date);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + nights);

      if (floor) {
        const roomsByFloor = await Room.find({
          floor
        }).populate({
          path: 'booking',
          match: {
            checkIn: { $lt: checkOut },
            checkOut: { $gt: checkIn },
          },
        }).lean()

        // console.log(roomsByFloor);
        return roomsByFloor.map(room => ({
          ...room,
          isBooked: (Array.isArray(room.booking) && room.booking.length > 0) || room.personPerRoom < personPerRoom,
        }))
      }

      // Get all rooms with related bookings that overlap with selected range
      const rooms = await Room.find().populate({
        path: 'booking',
        match: {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      }).lean();

      // Add isBooked field based on booking overlap or capacity
      return rooms.map(room => ({
        ...room,
        isBooked: (Array.isArray(room.booking) && room.booking.length > 0) || room.personPerRoom < personPerRoom,
      }));
    }

  },
  Mutation: {
    createUser: async (_: never, args: IUser) => {
      const newUser = await User.create({
        ...args,
        password: await bcrypt.hash(args.password, 10)
      })
      return newUser
    },
    createRoom: async (_: never, args: IRoom) => {
      const newRoom = await Room.create({
        ...args,
      })
      return newRoom
    },
    createTransaction: async (_: never, args: ITransaction) => {
      console.log(args);
      const newRoom = await Transaction.create({
        ...args,
      })
      return newRoom
    },
    createBooking: async (_, { input }) => {
      const { roomId, checkIn, checkOut, personPerRoom } = input;

      const parsedCheckIn = new Date(checkIn);
      const parsedCheckOut = new Date(checkOut);

      if (isNaN(parsedCheckIn.getTime()) || isNaN(parsedCheckOut.getTime())) {
        throw new Error("Invalid date format. Use YYYY-MM-DD.");
      }


      const booking = await Booking.create({
        room: roomId,
        checkIn: parsedCheckIn,
        checkOut: parsedCheckOut,
        numberOfPeople: personPerRoom,
        // user: req.user._id  <-- if required, pass this from auth context
      });

      await Room.findByIdAndUpdate(roomId, {
        $push: { booking: booking._id }
      });

      return booking;
    }

  }
};
