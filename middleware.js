const { listingSchema } = require("./schema.js");
const Listing = require("./models/listing");
const ExpressError = require("./utils/expressError.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please must be logged in.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = '/listings';
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Oops! Something went wrong. You are not owner of this Recipe.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errorMsg);
    }
    next();
};

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Oops! Something went wrong. You are not owner of Review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please log in.");
        return res.redirect("/login");
    }
    if (req.user.role !== 'admin') {
        req.flash("error", "Access denied. Admin only.");
        return res.redirect("/listings");
    }
    next();
};
