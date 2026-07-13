if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path"); //for setting up ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //for conectivity of boilerplate to others
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const User = require("./models/user.js");
const listingController = require("./controllers/listings.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();

const MONGO_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/voynica";
const SESSION_SECRET = process.env.SESSION_SECRET || "mysupersecretcode";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

//session stored in MongoDB so it survives serverless (Vercel) invocations
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600, //time period in seconds
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //security purposes, for crossscripting attacks
    },
};

app.use(session(sessionOptions)); //these must be written before parent route
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //to authenticate

passport.serializeUser(User.serializeUser()); //user se related jitni bhi info hai usko session mai store karne k liye, baar baar login na karne k liye
passport.deserializeUser(User.deserializeUser()); //unstore

//middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user; //for navbar.ejs
    next();
});

// Home page shows the same listings grid as /listings
app.get("/", wrapAsync(listingController.index));

//parent route
app.use("/listings", listingsRouter); //routes->listing.js
app.use("/listings/:id/reviews", reviewsRouter); //routes->review.js
app.use("/", userRouter); //routes->user.js

//checks all routes that it exists or not, if above routes doesn't match, this lower route(*,for all) matches
app.all(/.*/, (req, res, next) => {    //replace "*" to /.*/
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

module.exports = app;
