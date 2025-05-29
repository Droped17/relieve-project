// /* eslint-disable @typescript-eslint/no-unused-vars */

// import { ApolloServer } from '@apollo/server';
// import { startServerAndCreateNextHandler } from '@as-integrations/next';
// import { typeDefs } from '@/src/app/graphql/queries/user';
// import { resolvers } from '../../graphql/resolver/resolver';
// import { NextRequest } from 'next/server';
// import dbConnect from '@/src/lib/mongoose';

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// // interface RouteHandlerContext {
// //   params: {}; // Or { [key: string]: string | string[] }; if you might have dynamic params
// // }

// // const handler = startServerAndCreateNextHandler<NextRequest, RouteHandlerContext>(server, {
// //   context: async (req, res) => {
// //     // You can add your context logic here, e.g., authentication
// //     // For now, we just ensure `params` is present.
// //     return {
// //       req,
// //       res,
// //       params: {}, // Provide an empty params object
// //       // ... any other context properties you need
// //     };
// //   },
// // });

// export async function POST(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
//   await dbConnect()
//   const handler = startServerAndCreateNextHandler(server, {
//     context: async (req, res) => {
//       // You can add context here, like authenticated user, etc.
//       return { req, res };
//     },
//   });
//   return handler(req);
// }

// // For GET requests (e.g., Apollo Playground)
// export async function GET(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
//   await dbConnect()
//   const handler = startServerAndCreateNextHandler(server, {
//     context: async (req, res) => {
//       return { req, res };
//     },
//   });
//   return handler(req);
// }



// // export { handler as GET, handler as POST };


/* ========================================================== */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/src/app/graphql/queries/user'; // Adjust path as needed
import { resolvers } from '../../graphql/resolver/resolver'; // Adjust path as needed
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose'; // Adjust path as needed

// Initialize Apollo Server with your schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a single handler for the Apollo Server integration with Next.js
// This handler will be reused for GET and POST requests.
const apolloHandler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    // You can add context here, like authenticated user, etc.
    // The 'req' and 'res' objects are NextRequest and NextResponse respectively.
    return { req, res };
  },
});

// Helper function to set CORS headers on a NextResponse object
function setCorsHeaders(response: NextResponse, request: NextRequest) {
  const allowedOrigins = [
    'https://relieve-project.vercel.app',
    'https://relieve-project.vercel.app/', // Add with trailing slash
    'http://localhost:3000', // For local testing
  ];
  const requestOrigin = request.headers.get('origin');

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin);
  } else {

  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Connect to the database
  await dbConnect();

  // Call the Apollo handler once to process the request and get the response
  const response = await apolloHandler(req) as NextResponse<unknown>

  // Set CORS headers on the response received from the Apollo handler
  return setCorsHeaders(response, req)
}

// For GET requests (e.g., Apollo Playground, introspection queries)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Connect to the database
  await dbConnect();

  // Call the Apollo handler once to process the request and get the response
  const response = await apolloHandler(req) as NextResponse<unknown>

  // Set CORS headers on the response received from the Apollo handler
  return setCorsHeaders(response, req);
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  // Create a new NextResponse with a 204 No Content status for preflight
  const response = new NextResponse(null, { status: 204 });

  // Set CORS headers for the preflight response
  setCorsHeaders(response, request);

  // Cache preflight response for 24 hours (86400 seconds)
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
