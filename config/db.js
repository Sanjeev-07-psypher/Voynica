const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/voynica";

// Cache the connection across (warm) serverless invocations so we don't open a
// new pool on every request. `global` persists between invocations on Vercel.
let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URL);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;
