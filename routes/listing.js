//express router
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const Listing =require("../models/listings.js");
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing}= require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' }) //temp folder to save
const upload = multer({ storage }) //cloudinary storage to save

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Index route
router.get("/",wrapAsync(listingController.index)); //from controllers

//show route
router.get("/:id", wrapAsync(listingController.showListing));

// Create route
router.post("/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing, // first validate
    wrapAsync(listingController.createListing)
);
//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))

//delete route
router.delete("/:id",isOwner, wrapAsync(listingController.destroyListing))
module.exports=router;