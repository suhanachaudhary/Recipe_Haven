
//The Cloudinary Node SDK allows you to quickly and easily integrate your application with Cloudinary.
// Effortlessly optimize, transform, upload and manage your cloud's assets.
const cloudinary = require('cloudinary').v2

//A multer storage engine for Cloudinary. 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Storage can be configured using the options argument passed to the CloudinaryStorage constructor.

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder:"Recipe_Haven",
      allowedFormats:['png','jpg','jpeg','webp']
    },
  });

  module.exports={
    cloudinary,
    storage
  }