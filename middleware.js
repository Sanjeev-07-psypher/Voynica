const Listing = require("./models/listings");
const Review = require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema, reviewSchema }=require("./schema.js");

module.exports.isLoggedIn=(req,res,next) =>{
    // console.log(req.path,"..",req.original);
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must login to create a Listing!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; //saving session locally  
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


//changing app. to router.
module.exports.validateListing=(req,res,next)=>{  //middleware
    let {error}=listingSchema.validate(req.body); // validting through JOI
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{  //middleware
    let {error}=reviewSchema.validate(req.body); // validting through JOI
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


module.exports.isReviewAuthor= async(req,res,next)=>{  //middleware
    let {id,reviewId} =req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error", "You are not the creator of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();

};