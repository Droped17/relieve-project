import { Booking } from '@/src/models/Booking';
import { IRoom, Room } from '@/src/models/Room';
import { IUser, User } from '@/src/models/User';
import * as bcrypt from 'bcrypt'
import { Types } from 'mongoose';

export const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    rooms: async () => {
      return await Room.find();
    },
    // findRoomBy: async(_: unknown, args: {id?: string, floor?: number, status?: string}) => {
    //   const filter: any = {};
    //   if (args.id !== undefined) filter._id = new Types.ObjectId(args.id)
    //   if (args.floor !== undefined) filter.floor = args.floor 
    //   if (args.status !== undefined) filter.status = args.status

    //   return await Room.find(filter)
    // },
    findRoomBy: async(_: unknown,   args: {
      dateStart?: string;
      nights?: number;
      personPerRoom?: number;
      id?: string;
      floor?: number;
      status?: string;
    }) => {
      const filter: any = {};
      if (args.id !== undefined) filter._id = new Types.ObjectId(args.id)
      if (args.floor !== undefined) filter.floor = args.floor 
      if (args.status !== undefined) filter.status = args.status
      if (args.personPerRoom !== undefined) filter.personPerRoom = {$gte: args.personPerRoom};

      let unvailableRoomIds: Types.ObjectId[] = [];
      if (args.dateStart && args.nights) {
          const startDate = new Date(args.dateStart)
          const endDate = new Date(startDate)
          endDate.setDate(startDate.getDate() + args.nights)


          const conflictingBookings = await Booking.find({
            $or: [
              {dateEnd: {$gte: startDate}},
              {createdAt: {$lte: endDate}}
            ],
            status: {$ne: "cancelled"}
          }).select("room")

          unvailableRoomIds = conflictingBookings.map((b) => b.room);
          filter._id = {...filter._id, $nin: unvailableRoomIds}
          
      }
      

      return await Room.find(filter)
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
  },
  
};
