const joi = require("joi");

// server side schema validation
// joi is the npm package used to apply validation in the schema for server-side

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        ingredients: joi.string().required(),
        image: joi.string().allow("", null),
        country_of_recipe: joi.string().required(),
        category: joi.string().required(),
        cooking_time: joi.string().required(),
        instructions: joi.string().required(),
    }).required(),
});

//server side validation for reviews

module.exports.reviewSchema = joi.object({
    comment: joi.string().required(), // Ensure the comment is directly on the review
    rating: joi.number().required().min(1).max(5), // Rating remains the same
});


//validate using joi pachakge for server side
//then create validate review and add this in the route
