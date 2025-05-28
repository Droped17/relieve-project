/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/src/app/graphql/queries/user';
import { resolvers } from '../../graphql/resolver/resolver';
import { NextRequest } from 'next/server';
import dbConnect from '@/src/lib/mongoose';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// interface RouteHandlerContext {
//   params: {}; // Or { [key: string]: string | string[] }; if you might have dynamic params
// }

// const handler = startServerAndCreateNextHandler<NextRequest, RouteHandlerContext>(server, {
//   context: async (req, res) => {
//     // You can add your context logic here, e.g., authentication
//     // For now, we just ensure `params` is present.
//     return {
//       req,
//       res,
//       params: {}, // Provide an empty params object
//       // ... any other context properties you need
//     };
//   },
// });

export async function POST(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  await dbConnect()
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req, res) => {
      // You can add context here, like authenticated user, etc.
      return { req, res };
    },
  });
  return handler(req);
}

// For GET requests (e.g., Apollo Playground)
export async function GET(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  await dbConnect()
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req, res) => {
      return { req, res };
    },
  });
  return handler(req);
}



// export { handler as GET, handler as POST };