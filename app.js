const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path"); //for setting up ejs
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); //for conectivity of boilerplate to others
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require ("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wandrrlust";

main()
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log(err)
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000, //expires in 7 days
        maxAge: 7*24*60*60*1000,
        httpOnly:true, //security purposes, for crossscripting attacks
    },

};

app.get("/",(req,res)=>{
    res.render("./listings/home.ejs");
});


app.use(session(sessionOptions)); //these must be written before parent route
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//to authenticate

passport.serializeUser(User.serializeUser());//user se related jitni bhi info hai usko session mai store karne k liye, baar baar login na karne k liye
passport.deserializeUser(User.deserializeUser());//unstore

//middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser=req.user; //for navbar.ejs
    // console.log(res.locals.success);
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username: "student07",
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

//parent route
app.use("/listings",listingsRouter); //routes->listing.js
app.use("/listings/:id/reviews",reviewsRouter); //routes->review.js
app.use("/",userRouter); //routes->review.js


//checks all routes that it exists or not, if above routes doesn't match, this lower route(*,for all) matches
app.all(/.*/,(req,res,next)=>{    //replace "*" to /.*/ 
    next(new ExpressError(404,"Page not found!"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen(3000, ()=>{
    console.log("App is listening");
})

