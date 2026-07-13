// Vercel serverless entry point.
// Every request ensures the (cached) DB connection is ready, then hands off to
// the Express app. connectDB() is a no-op once the connection is warm.
require("dotenv").config();

const app = require("../app.js");
const connectDB = require("../config/db.js");

module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};
