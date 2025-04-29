// graphql/resolvers.ts
import dbConnect from '@/src/lib/mongoose';
import { User } from '@/src/models/User';

export const resolvers = {
  Query: {
    users: async () => {
      await dbConnect();
      return await User.find();
    },
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string; email: string }) => {
      // await dbConnect();
      const newUser = User.create({
        email,
        name
      })
      return newUser
    },
  },
};
