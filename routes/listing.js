const express=require("express");
const router=express.Router();
const { isLoggedIn ,validateListing, isOwner }=require("../middleware.js");
const wrapAsync=require("../utils/wrapAsync");


const multer  = require('multer') //handle the multipart form data only for image

const { storage }=require("../cloudConfig.js");
const upload = multer({ storage }) //store all images in dest:folder

const listingControllers=require("../controllers/listing.js");
//index route
router.get("/",wrapAsync(listingControllers.index));

router.get("/about",(req,res)=>{
    res.render("listings/about.ejs");
})

//privacy
router.get("/about/privacy",(req,res)=>{
    res.render("listings/privacy.ejs");
})

//new form route
router.get("/new",isLoggedIn,listingControllers.renderNewForm);

//show route
router.get("/:id",wrapAsync(listingControllers.showPage));

//post new recipe route
router.post("/",isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.newRecipe));

//render edit form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.renderEdit));

//edit data
router.put("/:id",isLoggedIn,isOwner, upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.editRecipe));

//delete listing
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingControllers.deleteRecipe));

module.exports=router;
