const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        ingredients: joi.string().required(),
        image: joi.string().allow("", null),
        country_of_recipe: joi.string().required(),
        category: joi.string().required(),
        cooking_time: joi.string().required(),
        diet: joi.string().valid('vegetarian', 'non-vegetarian', 'vegan').required(),
        cookingMinutes: joi.number().integer().min(1).required(),
        instructions: joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = joi.object({
    comment: joi.string().required(),
    rating: joi.number().required().min(1).max(5),
});
