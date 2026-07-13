// Vercel serverless entry point.
// Every request ensures the (cached) DB connection is ready, then hands off to
// the Express app. connectDB() is a no-op once the connection is warm.
require("dotenv").config();

const app = require("../app.js");
const connectDB = require("../config/db.js");

module.exports = async (req, res) => {
    try {
        await connectDB();
    } catch (err) {
        // Surface the real reason in Vercel's Runtime Logs instead of an opaque crash.
        console.error("DB connection failed:", err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end(
            "Database connection failed. Check the MONGODB_URI env var in Vercel " +
            "and Atlas Network Access (allow 0.0.0.0/0)."
        );
    }
    return app(req, res);
};
