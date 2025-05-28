
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/src/app/graphql/queries/user';
import { resolvers } from '../../graphql/resolver/resolver';
// import dbConnect from '@/src/lib/mongoose';
// import { createContext } from '../../graphql/context';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server)

export {handler as GET, handler as POST}

// export const GET = startServerAndCreateNextHandler(server, {
//   context: async (req) => {
//     await dbConnect(); 
//     // Call your createContext function with the request
//     const authContext = await createContext({ req });

//     console.log(`CONTEXT =>`,authContext);
    
//     // Merge database connection with auth context
//     return {
//       ...authContext,
//       // Add any additional context properties needed in resolvers
//       db: { connected: true }
//     };
//   },
// });

// export const POST = startServerAndCreateNextHandler(server, {
//   context: async (req) => {
//     await dbConnect();
//     const authContext = await createContext({ req });
    
//     return {
//       ...authContext,
//       db: { connected: true }
//     };
//   },
// });