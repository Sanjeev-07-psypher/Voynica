//signup
const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser= new User ({email,username});
        const registeredUser=  await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success","Welcome to WandrrLust");
        res.redirect("/listings");
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}))

//login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}), async(req,res)=>{ //passport provides an aunthenticate() function, which is used as route middleware to authenticate requests.
    req.flash("success","Welcome back to wandrrlust!");
    res.redirect("/listings");
})

//logged out
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports=router;