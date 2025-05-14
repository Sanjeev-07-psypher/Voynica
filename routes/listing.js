//express router
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema }=require("../schema.js");
const Listing =require("../models/listings.js");
const passport = require("passport");
const {isLoggedIn}= require("../middleware.js");

//changing app. to router.
const validateListing=(req,res,next)=>{  //middleware
    let {error}=listingSchema.validate(req.body); // validting through JOI
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//new route
router.get("/new",isLoggedIn, async (req, res) => {
    res.render("./listings/new.ejs");
});
//Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you are trying to search Does not Exists!");
        return res.redirect("/listings"); //added return
    }
    // return
    res.render("./listings/show.ejs", { listing });
}));
// Create route
router.post("/",
    isLoggedIn,
    validateListing, // first validate
    wrapAsync(async (req, res, next) => { // then handle the logic
      const listingData = req.body.listing;
  
      // Set default image if not provided
      if (!listingData.image || !listingData.image.url) {
        listingData.image = {
          filename: "default",
          url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        };
      }
  
      const newListing = new Listing(listingData);
      await newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
    })
  );
//edit route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are trying to search Does not Exists!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let{id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); // ... deconstructing
    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}))
//delete route
router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}))
module.exports=router;