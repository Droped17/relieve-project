/* eslint-disable no-var */
// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI!;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) return cached.conn;
//   console.log('Connect');
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
//   }
//   console.log('Connect');
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// 1. Declare the type for your cached Mongoose connection
interface MongooseCachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 2. Augment the global object's interface
// This tells TypeScript that 'global' (or 'globalThis') *can* have a 'mongoose' property
// of type 'MongooseCachedConnection'.
declare global {
  var mongoose: MongooseCachedConnection; // Use 'var' for global declarations in TS
}

// 3. Initialize cached variable using the augmented global type
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached DB connection.'); // Informative message
    return cached.conn;
  }

  // Ensure only one connection promise is active
  if (!cached.promise) {
    console.log('Connecting to DB...'); // Informative message
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('DB connected successfully!'); // Informative message
      return mongoose;
    }).catch(err => {
      console.error('DB connection failed:', err); // Error logging
      cached.promise = null; // Reset promise if connection fails to retry
      throw err; // Re-throw the error
    });
  } else {
    console.log('Waiting for existing DB connection...'); // Informative message
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;