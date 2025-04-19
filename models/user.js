
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

    const userSchema=new mongoose.Schema(
        {
            email: {
                type:String,
                required:true,
                unique:true,
            },
    });
    
userSchema.plugin(passportLocalMongoose);//automaically add the username ,password and saltin

module.exports = mongoose.model('User', userSchema);



