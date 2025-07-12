//express router
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // cloudinary storage

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ✅ Unified Search Route (Search Bar + Filter Icons)
router.get("/search", wrapAsync(listingController.searchListings));

// Index route
router.get("/", wrapAsync(listingController.index));

// Show listing
router.get("/:id", wrapAsync(listingController.showListing));

// Create listing
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// Edit listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete listing
router.delete("/:id", isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
