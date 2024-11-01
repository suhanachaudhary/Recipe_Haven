const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        min:0,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

module.exports=mongoose.model("Review",reviewSchema);