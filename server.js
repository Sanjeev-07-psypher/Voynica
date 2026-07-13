// Local development entry point.
// (On Vercel the app is served through api/index.js instead — there is no
// long-running process there, so app.listen() must not be called.)
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const app = require("./app.js");
const connectDB = require("./config/db.js");

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        console.log("connected to database");
        app.listen(PORT, () => {
            console.log(`Voynica is listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("DB connection error:", err);
    });
