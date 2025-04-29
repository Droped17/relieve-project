
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/src/app/graphql/queries/user';
import { resolvers } from '../../graphql/resolver/user';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const GET = startServerAndCreateNextHandler(server);
export const POST = startServerAndCreateNextHandler(server);
