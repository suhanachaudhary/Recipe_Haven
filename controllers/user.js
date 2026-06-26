const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Notification = require("../models/notification.js");
const { sendEmail, followEmailHtml } = require("../utils/mailer");

module.exports.signupRender = async (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.postSignup = async (req, res, next) => {
    let { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Recipe Haven! Your account was created successfully.");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", "You're already registered with us! Let's get you back in the kitchen—please log in.");
        res.redirect("/signup");
    }
};

module.exports.loginRender = async (req, res) => {
    res.render("user/login.ejs");
};

module.exports.loginPost = async (req, res) => {
    req.flash("success", "Welcome back to Recipe Haven! Ready to find and share delicious recipes?");
    res.redirect(res.locals.redirectUrl);
};

module.exports.logoutPage = async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out! Don't be a stranger—our recipes will miss you!");
        res.redirect("/listings");
    });
};

module.exports.showProfile = async (req, res) => {
    try {
        const profileUser = await User.findOne({ username: req.params.username })
            .populate('savedRecipes')
            .populate('followers')
            .populate('following');

        if (!profileUser) {
            req.flash("error", "User not found.");
            return res.redirect("/listings");
        }

        const userRecipes = await Listing.find({ owner: profileUser._id }).sort({ createdAt: -1 });

        const totalLikes = userRecipes.reduce((sum, r) => sum + r.likes.length, 0);
        const totalViews = userRecipes.reduce((sum, r) => sum + r.views, 0);
        const recentRecipes = userRecipes.slice(0, 5);

        const isFollowing = req.user
            ? profileUser.followers.some(f => f._id.equals(req.user._id))
            : false;

        res.render("user/profile.ejs", {
            profileUser,
            userRecipes,
            totalLikes,
            totalViews,
            recentRecipes,
            isFollowing,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
};

module.exports.toggleSave = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Please login to save recipes." });
    }
    try {
        const user = await User.findById(req.user._id);
        const listing = await Listing.findById(req.params.id);

        if (!listing) return res.status(404).json({ message: "Recipe not found." });

        const alreadySaved = user.savedRecipes.some(id => id.equals(listing._id));

        if (alreadySaved) {
            user.savedRecipes = user.savedRecipes.filter(id => !id.equals(listing._id));
            listing.savedBy = listing.savedBy.filter(id => !id.equals(user._id));
        } else {
            user.savedRecipes.push(listing._id);
            listing.savedBy.push(user._id);
        }

        await user.save();
        await listing.save();

        res.json({ saved: !alreadySaved, saveCount: listing.savedBy.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports.toggleFollow = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Please login to follow users." });
    }
    try {
        const targetUser = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user._id);

        if (!targetUser) return res.status(404).json({ message: "User not found." });
        if (targetUser._id.equals(currentUser._id)) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const isFollowing = currentUser.following.some(id => id.equals(targetUser._id));

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => !id.equals(targetUser._id));
            targetUser.followers = targetUser.followers.filter(id => !id.equals(currentUser._id));
        } else {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);

            await Notification.create({
                recipient: targetUser._id,
                sender:    currentUser._id,
                type:      'follow',
                message:   `${currentUser.username} started following you.`,
            });

            // Send email notification to followed user
            if (targetUser.email) {
                sendEmail({
                    to:      targetUser.email,
                    subject: `🎉 ${currentUser.username} started following you on Recipe Haven`,
                    html:    followEmailHtml(targetUser.username, currentUser.username),
                }).catch(e => console.error('Email error (follow):', e.message));
            }
        }

        await currentUser.save();
        await targetUser.save();

        res.json({ following: !isFollowing, followerCount: targetUser.followers.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
};
