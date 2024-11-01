

const User=require("../models/user.js");

//signup page render
module.exports.signupRender=async(req,res)=>{
    res.render("user/signup.ejs");
}

//post signup page
module.exports.postSignup=async(req,res)=>{
    let {username,email,password}=req.body;
    try {
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password); // Pass both the user object and password
        console.log(registerUser);

        //passport login method
        req.login(registerUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome to Recipe Haven! Your account was created successfully.");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", "You're already registered with us! Let’s get you back in the kitchen—please log in.");
        res.redirect("/signup"); // Redirect to signup if there's an error
    }
}

//login page render
module.exports.loginRender=async(req,res)=>{
    res.render("user/login.ejs");
}

//login post
module.exports.loginPost=async(req,res)=>{
    req.flash("success","Welcome back to Recipe Haven! Ready to find and share delicious recipes?");
    res.redirect(res.locals.redirectUrl);
}

//logout page
module.exports.logoutPage=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Logged out! Don't be a stranger—our recipes will miss you!");
        res.redirect("/listings");
    });
}