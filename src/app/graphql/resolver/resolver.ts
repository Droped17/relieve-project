import { Booking, EBookingStatus, IBooking } from '@/src/models/Booking';
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
    // rooms: async (

    //   _: unknown,
    //   args: {
    //     date?: string;
    //     nights?: number;
    //     numberOfPeople?: number;
    //   }
    // ) => {
    //   const allRooms = await Room.find();

    //   // Only apply availabilityStatus logic if all 3 params are provided
    //   if (args.date && args.nights && args.numberOfPeople) {
    //     const startDate = new Date(args.date);
    //     const endDate = new Date(startDate);
    //     // Calculate End Date
    //     endDate.setDate(startDate.getDate() + args.nights);

    //     const bookings = await Booking.find({
    //       status: { $ne: 'CANCELLED' },
    //       $or: [
    //         {
    //           dateEnd: { $gte: startDate },
    //           createdAt: { $lte: endDate },
    //         },
    //       ],
    //     }).select('room');

    //     console.log(bookings);

    //     const bookedRoomSet = new Set(bookings.map((b) => b.room.toString()));

    //     return allRooms.map((room) => {
    //       let availabilityStatus: 'full' | 'empty' | 'unavailable';

    //       if (room.personPerRoom < args.numberOfPeople!) {
    //         availabilityStatus = 'unavailable';
    //       } else if (bookedRoomSet.has(room._id.toString())) {
    //         availabilityStatus = 'full';
    //       } else {
    //         availabilityStatus = 'empty';
    //       }

    //       return {
    //         ...room.toObject(),
    //         availabilityStatus,
    //       };
    //     });
    //   }

    //   // Return raw rooms if no filter provided
    //   return allRooms.map((room) => ({
    //     ...room.toObject(),
    //     availabilityStatus: null,
    //   }));
    // },
    // findRoomBy: async(_: unknown, args: {id?: string, floor?: number, status?: string}) => {
    findRoomBy: async (
  _: unknown,
  args: {
    id?: string;
    floor?: number;
    status?: string;
    date?: string;
    nights?: number;
    numberOfPeople?: number;
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

    console.log(startDate);
    console.log(endDate);

    const bookings = await Booking.find({
      status: { $ne: 'CANCELLED' },
      $or: [
        {
          date: { $gte: startDate },
          createdAt: { $lte: endDate },
        },
      ],
    }).select('room');

    console.log(bookings);

    const bookedRoomSet = new Set(bookings.map((b) => b.room.toString()));

    return allRooms.map((room) => {
      let availabilityStatus: 'full' | 'empty' | 'unavailable';

      if (room.personPerRoom < numberOfPeople) {
        availabilityStatus = 'unavailable';
      } else if (bookedRoomSet.has(room._id.toString())) {
        availabilityStatus = 'full';
      } else {
        availabilityStatus = 'empty';
      }

      return {
        ...room.toObject(),
        availabilityStatus,
      };
    });
  }

  // Return rooms without availability if date filters are missing
  return allRooms.map((room) => ({
    ...room.toObject(),
    availabilityStatus: null,
  }));
},
    //   const filter: any = {};
    //   if (args.id !== undefined) filter._id = new Types.ObjectId(args.id)
    //   if (args.floor !== undefined) filter.floor = args.floor 
    //   if (args.status !== undefined) filter.status = args.status

    //   return await Room.find(filter)
    // },
    booking: async () => {
      return await Booking.find();
    },
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
      console.log(args);
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
    // createBooking: async (_: never, args: IBooking) => {
    //   console.log(args);
    //   const newBooking = await Booking.create({
    //     ...args,
    //   })
    //   return newBooking
    // },
      createBooking: async (_: any, { input }: any, context: any) => {
      const { roomId, nights, request, guest, date, numberOfPeople } = input;

      console.log(`NIGHTS => `,nights);

      // 1. Find the room
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");
      
      // 2. Calculate total price (assume 1 night for now)
      const totalPrice = room.price; // You can multiply by nights later
      
      /* [TODO]: can't find night */
      // 3. Create Booking
      const booking = await Booking.create({
        room: room._id,
        date,
        numberOfPeople,
        nights,
        request,
        guest: guest || undefined,
        user: context?.user?._id || undefined,
        // status: EBookingStatus.PENDING,
      });

      console.log(booking);

      return booking
    
  },
}
};
