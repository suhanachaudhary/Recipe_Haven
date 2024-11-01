
const mongoose=require("mongoose");
require('dotenv').config();
const listing=require("../models/listing");
const initData = require("./data.js");
const port=process.env.PORT || 5000;
const mongoUrl="mongodb://127.0.0.1:27017/foodwebsite";

mongoose.connect(mongoUrl)
.then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log(err);
});

const initDB=async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"6721a57d94ba45dd87c98d90"
    }));
    await listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();