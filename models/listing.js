
const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String], // An array of strings
      required: true, // Assuming ingredients are required
    },
    image: {
      url:String,
      filename:String,
    },
    country_of_recipe: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    cooking_time:{
        type:String,
        required:true
    },
    instructions: {
      type: [String], // An array of strings
      required: true, // Assuming instructions are required
    },

    //connect review and lsting relationship
    reviews: [
      { type: Schema.Types.ObjectId, ref: "Review" }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

ListingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id: {$in:listing.reviews }});
  }
})

const ListingModel = mongoose.model("Listing", ListingSchema);
module.exports = ListingModel;
