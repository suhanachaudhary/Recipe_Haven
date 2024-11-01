
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewOwner }=require("../middleware.js");

const reviewController=require("../controllers/review.js");


// POST route for adding a review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));


// DELETE route for removing a review
router.delete("/:reviewId",isLoggedIn,isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;
