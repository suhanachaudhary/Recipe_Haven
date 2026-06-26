const Listing = require("../models/listing");
const User = require("../models/user");
const Review = require("../models/reviews");

module.exports.dashboard = async (req, res) => {
    try {
        const [totalUsers, totalRecipes, totalReviews] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Review.countDocuments(),
        ]);

        const allListings = await Listing.find({}, 'title likes views reviews');

        const totalLikes = allListings.reduce((sum, l) => sum + l.likes.length, 0);

        const mostViewed = await Listing.find()
            .sort({ views: -1 })
            .limit(5)
            .select('title views');

        const topRated = await Listing.aggregate([
            { $lookup: { from: 'reviews', localField: 'reviews', foreignField: '_id', as: 'reviewDocs' } },
            { $addFields: { avgRating: { $avg: '$reviewDocs.rating' }, reviewCount: { $size: '$reviewDocs' } } },
            { $match: { reviewCount: { $gt: 0 } } },
            { $sort: { avgRating: -1 } },
            { $limit: 5 },
            { $project: { title: 1, avgRating: 1, reviewCount: 1 } },
        ]);

        const recentUsers = await User.find({}, 'username email createdAt role')
            .sort({ _id: -1 })
            .limit(5);

        res.render("admin/dashboard.ejs", {
            totalUsers,
            totalRecipes,
            totalReviews,
            totalLikes,
            mostViewed,
            topRated,
            recentUsers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
};
