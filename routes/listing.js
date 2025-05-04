
const express=require("express");
const router=express.Router();
const { isLoggedIn ,validateListing, isOwner }=require("../middleware.js");
const wrapAsync=require("../utils/wrapAsync");
const Listing = require("../models/listing");

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



router.post("/:id/like", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const userId = req.user._id;
  
    // Remove from dislikes if present
    listing.dislikes = listing.dislikes.filter(id => id.toString() !== userId.toString());
  
    if (!listing.likes.includes(userId)) {
      listing.likes.push(userId);
    } else {
      // toggle off like
      listing.likes = listing.likes.filter(id => id.toString() !== userId.toString());
    }
  
    await listing.save();
    res.json({ likes: listing.likes.length, dislikes: listing.dislikes.length });
  });
  
  // Dislike a listing
  router.post("/:id/dislike", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const userId = req.user._id;
  
    // Remove from likes if present
    listing.likes = listing.likes.filter(id => id.toString() !== userId.toString());
  
    if (!listing.dislikes.includes(userId)) {
      listing.dislikes.push(userId);
    } else {
      // toggle off dislike
      listing.dislikes = listing.dislikes.filter(id => id.toString() !== userId.toString());
    }
  
    await listing.save();
    res.json({ likes: listing.likes.length, dislikes: listing.dislikes.length });
  });
  

router.get('/search', async (req, res) => {
    const query = req.query.query;
    const recipes = await Listing.find({
      title: { $regex: query, $options: 'i' }
    });
    res.render('searchresults', { recipes });
  });
  

module.exports=router;
