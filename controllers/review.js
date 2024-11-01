const Review = require("../models/reviews");
const Listing = require("../models/listing");

module.exports.postReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const newReview = new Review({
        comment: req.body.comment, // Make sure to pull comment from req.body
        rating: req.body.rating, // Pull rating from req.body
        author: req.user._id // Assign the author
    }); // Now we directly use req.body
    //newReview.author = req.user._id; // Set the review author
    listing.reviews.push(newReview._id); // Add the review ID to the listing

    await newReview.save(); // Save the review
    await listing.save(); // Update the listing

    req.flash("success", "Thank you for your review! Your feedback helps others too.");
    res.redirect(`/listings/${listing._id}`);
}

//delete review
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    console.log("Review deleted");
    req.flash("error","Review deleted. Thank you for updating your feedback!")
    res.redirect(`/listings/${id}`);
}