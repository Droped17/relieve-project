import { IUser, User } from '@/src/models/User';
import * as bcrypt from 'bcrypt'

export const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
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
  },
};
