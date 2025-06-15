/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApolloServer } from '@apollo/server';
import { NextRequest, NextResponse } from 'next/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/src/app/graphql/queries/user';
import { resolvers } from '@/src/app/graphql/resolver/resolver';
import dbConnect from '@/src/lib/mongoose';
import { createContext } from '../../graphql/context';

// Initialize Apollo Server with your schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


// Create a single handler for the Apollo Server integration with Next.js
// This handler will be reused for GET and POST requests.
const apolloHandler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest, res) => {
    // You can add context here, like authenticated user, etc.
    // The 'req' and 'res' objects are NextRequest and NextResponse respectively.
    const authContext = await createContext({req})
    return { req, res, ...authContext };
  },
});

// Helper function to set CORS headers on a NextResponse object
function setCorsHeaders(response: NextResponse, request: NextRequest) {
  const allowedOrigins = [
    'https://relieve-project.vercel.app',
    'https://relieve-project.vercel.app/',
    'http://localhost:3000', // For local testing
    'http://localhost:3000/', // For local testing
  ];
  const requestOrigin = request.headers.get('origin');

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin);
    // console.log('Access-Control-Allow-Origin set to:', requestOrigin);
  } else {
    console.warn('Origin NOT allowed or missing:', requestOrigin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Connect to the database
  const result = await dbConnect();
  // console.log(`CONNECT DB`, result);

  // Call the Apollo handler once to process the request and get the response
  const response = await apolloHandler(req) as NextResponse<unknown>

  // Set CORS headers on the response received from the Apollo handler
  return setCorsHeaders(response, req)
}

// For GET requests (e.g., Apollo Playground, introspection queries)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Connect to the database
  const result = await dbConnect();
  console.log(`CONNECT DB`, result);

  // Call the Apollo handler once to process the request and get the response
  const response = await apolloHandler(req) as NextResponse<unknown>

  // Set CORS headers on the response received from the Apollo handler
  return setCorsHeaders(response, req);
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  // Create a new NextResponse with a 204 No Content status for preflight
  let response = new NextResponse(null, { status: 204 });

  // Set CORS headers for the preflight response
  // setCorsHeaders(response, request);
  response = setCorsHeaders(response, request);

  // Cache preflight response for 24 hours (86400 seconds)
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
