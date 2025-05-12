import { Booking } from '@/src/models/Booking';
import { IRoom, Room } from '@/src/models/Room';
import { ITransaction, Transaction } from '@/src/models/Transaction';
import { IUser, User } from '@/src/models/User';
import * as bcrypt from 'bcrypt'
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

      console.log(allRooms);

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

        console.log(bookings);

        const bookedRoomSet = new Set(bookings.map((b) => b.room.toString()));

        console.log(bookedRoomSet);

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
    //   const filter: any = {};
    //   if (args.id !== undefined) filter._id = new Types.ObjectId(args.id)
    //   if (args.floor !== undefined) filter.floor = args.floor 
    //   if (args.status !== undefined) filter.status = args.status

    //   return await Room.find(filter)
    // },
    booking: async () => {
      // populate User and Room
      return await Booking.find().populate('user').populate('room')
    },
    rooms: async () => {
      return await Room.find()
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
    createBooking: async (_: any, { input }: any, context: any) => {
      const { roomId, nights, request, guest, dateStart, numberOfPeople, userId } = input;

      // 1. Find the room
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");

      // 2. Calculate total price (assume 1 night for now)
      const totalPrice = room.price * nights  // You can multiply by nights later

      const startDate = new Date(dateStart);
      const dateEnd = new Date(dateStart);

      dateEnd.setDate(startDate.getDate() + nights);

      // 3. Create Booking
      const booking = await Booking.create({
        dateStart,
        dateEnd,
        numberOfPeople,
        nights,
        request,
        guest: guest || undefined,
        room: room._id,
        user: userId
      });

      console.log(booking);
      return booking

    },
  }
};
