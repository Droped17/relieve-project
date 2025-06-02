/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri: string = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// This approach is common for Next.js to prevent multiple client instances
// during development with Hot Module Replacement (HMR).
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  const globalWithMongo = global as typeof globalThis & { _mongoClient: MongoClient };

  if (!globalWithMongo._mongoClient) {
    // console.log('MongoDB: Initializing new client for development...');
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  } else {
    // console.log('MongoDB: Reusing existing client for development (HMR).');
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production, always create a new client.
  // console.log('MongoDB: Initializing new client for production...');
  client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient promise.
// This ensures that the connection is established only once and reused.
clientPromise = client.connect()
  .then((connectedClient) => {
    console.log('MongoDB: Successfully connected to database!');
    return connectedClient;
  })
  .catch((error) => {
    console.error('MongoDB: Connection failed!', error);
    throw error; // Re-throw the error so the app knows connection failed
  });

export default clientPromise;