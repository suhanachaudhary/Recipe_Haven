const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userControllers = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup", userControllers.signupRender);
router.post("/signup", userControllers.postSignup);

router.get("/login", userControllers.loginRender);
router.post("/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    userControllers.loginPost
);

router.get("/logout", userControllers.logoutPage);

router.get("/profile/:username", wrapAsync(userControllers.showProfile));

router.post("/listings/:id/save", wrapAsync(userControllers.toggleSave));

router.post("/user/:userId/follow", wrapAsync(userControllers.toggleFollow));

module.exports = router;
