const Listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => { //iss fxn ka kaam hai to render listings
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are trying to search Does not Exists!");
        return res.redirect("/listings"); //added return
    }
    // console.log(listing);
    // return
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => { // then handle the logic
    let response= await geocodingClient
        .forwardGeocode({
        query: req.body.listing.location, // location from the form
        limit: 1,
    })
        .send();

    // console.log(response.body.features[0].geometry.coordinates);
        
    let url = req.file.path;
    let filename = req.file.filename;
    //   console.log(url, ".." , filename);
    const listingData = req.body.listing;
    // Set default image if not provided
    if (!listingData.image || !listingData.image.url) {
        listingData.image = {
            filename: "default",
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        };
    }
    const newListing = new Listing(listingData);
    //   console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry; // setting the geometry from geocoding response
    let savedListing= await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


//search bar
module.exports.searchListings = async (req, res) => {
  const { query, category } = req.query;
  let filter = {};

  // If category selected (not "All")
  if (category && category !== "All") {
    filter.category = category;
  }

  // If search input provided
  if (query && query.trim() !== "") {
    const regex = new RegExp(query.trim(), "i");
    filter.$or = [
      { title: regex },
      { location: regex }
    ];
  }

  try {
    const listings = await Listing.find(filter);

    res.render("listings/searchResults", {
      allListings: listings,
      category: category || null,
      searchQuery: query || null
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while searching.");
    res.redirect("/listings");
  }
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are trying to search Does not Exists!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });

};


module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    };

module.exports.destroyListing = async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing Deleted!");
    
        res.redirect("/listings");
    };
    
