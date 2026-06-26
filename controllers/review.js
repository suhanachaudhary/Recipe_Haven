const Review = require("../models/reviews");
const Listing = require("../models/listing");
const Notification = require("../models/notification");
const { sendEmail, commentEmailHtml } = require("../utils/mailer");

module.exports.postReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('owner');

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const newReview = new Review({
        comment: req.body.comment,
        rating: req.body.rating,
        author: req.user._id,
    });

    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();

    if (listing.owner && !listing.owner._id.equals(req.user._id)) {
        await Notification.create({
            recipient: listing.owner._id,
            sender:    req.user._id,
            type:      'comment',
            listing:   listing._id,
            message:   `${req.user.username} commented on your recipe "${listing.title}".`,
        });

        // Send email notification to recipe owner
        if (listing.owner.email) {
            sendEmail({
                to:      listing.owner.email,
                subject: `💬 ${req.user.username} reviewed your recipe on Recipe Haven`,
                html:    commentEmailHtml(
                    listing.owner.username,
                    req.user.username,
                    listing.title,
                    req.body.comment,
                    listing._id,
                ),
            }).catch(e => console.error('Email error (comment):', e.message));
        }
    }

    req.flash("success", "Thank you for your review! Your feedback helps others too.");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted.");
    res.redirect(`/listings/${id}`);
};
