import { IUser, User } from '@/src/models/User';

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
      })
      return newUser
    },
  },
};
