const express = require("express");
const router = express.Router();
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Notification = require("../models/notification");
const User = require("../models/user");
const { sendEmail, likeEmailHtml } = require("../utils/mailer");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingControllers = require("../controllers/listing.js");

router.get("/", wrapAsync(listingControllers.index));

router.get("/about", (req, res) => {
    res.render("listings/about.ejs");
});

router.get("/about/privacy", (req, res) => {
    res.render("listings/privacy.ejs");
});

router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.get("/:id", wrapAsync(listingControllers.showPage));

router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.newRecipe));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEdit));

router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.editRecipe));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingControllers.deleteRecipe));

router.post("/:id/like", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Please login to like recipes." });

    try {
        const listing = await Listing.findById(req.params.id);
        const userId = req.user._id;

        listing.dislikes = listing.dislikes.filter(id => !id.equals(userId));
        const alreadyLiked = listing.likes.some(id => id.equals(userId));

        if (!alreadyLiked) {
            listing.likes.push(userId);
            if (!listing.owner.equals(userId)) {
                await Notification.create({
                    recipient: listing.owner,
                    sender:    userId,
                    type:      'like',
                    listing:   listing._id,
                    message:   `${req.user.username} liked your recipe "${listing.title}".`,
                });

                // Send email to recipe owner
                const owner = await User.findById(listing.owner).select('email username');
                if (owner && owner.email) {
                    sendEmail({
                        to:      owner.email,
                        subject: `❤️ ${req.user.username} liked your recipe on Recipe Haven`,
                        html:    likeEmailHtml(owner.username, req.user.username, listing.title, listing._id),
                    }).catch(e => console.error('Email error (like):', e.message));
                }
            }
        } else {
            listing.likes = listing.likes.filter(id => !id.equals(userId));
        }

        await listing.save();
        res.json({ likes: listing.likes.length, dislikes: listing.dislikes.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});

router.post("/:id/dislike", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Please login to dislike recipes." });

    try {
        const listing = await Listing.findById(req.params.id);
        const userId = req.user._id;

        listing.likes = listing.likes.filter(id => !id.equals(userId));
        const alreadyDisliked = listing.dislikes.some(id => id.equals(userId));

        if (!alreadyDisliked) {
            listing.dislikes.push(userId);
        } else {
            listing.dislikes = listing.dislikes.filter(id => !id.equals(userId));
        }

        await listing.save();
        res.json({ likes: listing.likes.length, dislikes: listing.dislikes.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
