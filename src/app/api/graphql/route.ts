
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/src/app/graphql/queries/user';
import { resolvers } from '../../graphql/resolver/user';
import dbConnect from '@/src/lib/mongoose';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const GET = startServerAndCreateNextHandler(server, {
  context: async () => {
    await dbConnect();
    return {};
  },
});
export const POST = startServerAndCreateNextHandler(server, {
  context: async () => {
    await dbConnect();
    return {};
  },
});
