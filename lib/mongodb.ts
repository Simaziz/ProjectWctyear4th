import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/** * Global is used here to maintain a cached connection across hot-reloads 
 * in development. This prevents connections from growing exponentially.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const dbConnect = async () => {
  // 1. If we have a connection, use it
  if (cached.conn) {
    return cached.conn;
  }

  // 2. If we don't have a promise, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if connection drops
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ New MongoDB connection established");
      return mongoose;
    });
  }

  // 3. Wait for the promise to resolve and cache the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};