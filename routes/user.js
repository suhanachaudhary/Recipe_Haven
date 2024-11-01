
const express = require("express");
const router = express.Router();
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userControllers=require("../controllers/user.js");


//signup page route
router.get("/signup",userControllers.signupRender)
//signup post route
router.post("/signup",userControllers.postSignup)


//login page route
router.get("/login",userControllers.loginRender);

//login post page
//passsport.authenticate is the middleware provided by passport which is used to authenticate the user before login
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    userControllers.loginPost
);

//logout route
router.get("/logout",userControllers.logoutPage)

module.exports=router;