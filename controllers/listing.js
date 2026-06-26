const Listing = require("../models/listing");
const ExpressError = require("../utils/expressError.js");

module.exports.index = async (req, res) => {
    const { q, category, diet, maxTime, page = 1 } = req.query;
    const limit = 12;
    const skip = (parseInt(page) - 1) * limit;

    const query = {};

    if (q) {
        query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { ingredients: { $regex: q, $options: 'i' } },
        ];
    }
    if (category) query.category = { $regex: category, $options: 'i' };
    if (diet) query.diet = diet;
    if (maxTime) query.cookingMinutes = { $lte: parseInt(maxTime), $gt: 0 };

    const totalCount = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const allListing = await Listing.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.render("listings/index.ejs", {
        allListing,
        currentPage: parseInt(page),
        totalPages,
        filters: { q, category, diet, maxTime },
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showPage = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

        if (!listing) {
            req.flash("error", "We couldn't find that recipe. Try searching for something else delicious!");
            return res.redirect("/listings");
        }

        const isSaved = req.user ? req.user.savedRecipes.some(rid => rid.equals(listing._id)) : false;
        const isFollowing = req.user && listing.owner
            ? listing.owner.followers.some(fid => fid.equals(req.user._id))
            : false;

        res.render("listings/show.ejs", { listing, isSaved, isFollowing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
};

module.exports.newRecipe = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Your recipe is live! Get ready to inspire some delicious dishes.");
    res.redirect("/listings");
};

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "We couldn't find that recipe. Try searching for something else delicious!");
        }
        res.render("listings/edit.ejs", { listing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
};

module.exports.editRecipe = async (req, res) => {
    const { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data");
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (!updatedListing) {
            return res.status(404).send("Listing not found.");
        }

        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = { url, filename };
            await updatedListing.save();
        }

        req.flash("success", "Recipe edited successfully! Ready for another round of taste testing.");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
};

module.exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteListing = await Listing.findByIdAndDelete(id);
        if (!deleteListing) {
            return res.status(404).send("Listing not found.");
        }
        req.flash("success", "Recipe removed. We hope you try something new!");
        res.redirect(`/listings`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
};
