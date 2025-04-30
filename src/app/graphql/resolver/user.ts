import { User } from '@/src/models/User';

interface User {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  role: string
}

export const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
  },
  Mutation: {
    createUser: async (_: never, args: User) => {
      const newUser = await User.create({
        ...args,
      })
      return newUser
    },
  },
};
