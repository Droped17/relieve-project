import { IRoom, Room } from '@/src/models/Room';
import { IUser, User } from '@/src/models/User';
import * as bcrypt from 'bcrypt'
import { ObjectId } from 'mongoose';

export const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    rooms: async () => {
      return await Room.find();
    },
    findRoomBy: async(_: unknown, args: {floor?: number, status?: string}) => {
      console.log(args);
      const filter: any = {};
      if (args.floor !== undefined) filter.floor = args.floor 
      if (args.status !== undefined) filter.status = args.status
      
      console.log(filter);

      return await Room.find(filter)
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
      console.log(args);
      const newRoom = await Room.create({
        ...args,
      })
      return newRoom
    },
  },
  
};
