const Listing=require("../models/listing");

const ExpressError=require("../utils/expressError.js");

//controllers maintain the backend functionality store backend code for make the routes more readable
module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

//new form recipe
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

//show recipe page
module.exports.showPage=async(req,res)=>{
    
    const { id } = req.params;

    try {
        const listing = await Listing.findById(id).populate({ path:"reviews" ,populate:{path:"author",},

    })
        .populate("owner"); // Await the database call

        if(!listing){
            req.flash("error","We couldn’t find that recipe. Try searching for something else delicious!");
            res.redirect("/listings");
        }
        console.log(listing)
        res.render("listings/show.ejs", { listing });
        
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Server error."); // Handle server error
    }   
}

//new recipe post added
module.exports.newRecipe=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={ url,filename };
    await newListing.save();
    req.flash("success","Your recipe is live! Get ready to inspire some delicious dishes.");
    res.redirect("/listings");
    next(err);   
}

//open edit form
module.exports.renderEdit=async(req,res)=>{
    const { id } = req.params;

    try {
        const listing = await Listing.findById(id); // Await the database call
        if (!listing) {
            req.flash("error","We couldn’t find that recipe. Try searching for something else delicious!");
        }
        res.render("listings/edit.ejs", { listing });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Server error."); // Handle server error
    }
}

//edit post recipe
module.exports.editRecipe=async(req,res)=>{
    const { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data");
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
        
        if (!updatedListing) {
            return res.status(404).send("Listing not found.");
        }

        if(req.file){
            let url=req.file.path;
            let filename=req.file.filename;
            updatedListing.image={url,filename};
            await updatedListing.save();
        }

        req.flash("success","Recipe edited successfully! Ready for another round of taste testing.");
        res.redirect(`/listings/${id}`);

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Server error."); // Handle server error
    }
}

//delet recipe
module.exports.deleteRecipe=async(req,res)=>{
    const { id } = req.params;
    try {
        
        const deleteListing= await Listing.findByIdAndDelete(id);
        
        if (!deleteListing) {
            return res.status(404).send("Listing not found.");
        }
        req.flash("success","Recipe removed. We hope you try something new!");
        res.redirect(`/listings`);

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Server error."); // Handle server error
    }
}