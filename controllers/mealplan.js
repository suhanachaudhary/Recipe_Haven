const MealPlan = require("../models/mealplan");
const Listing  = require("../models/listing");

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

module.exports.showPlanner = async (req, res) => {
    try {
        let plan = await MealPlan.findOne({ user: req.user._id });
        if (!plan) plan = await MealPlan.create({ user: req.user._id });

        for (const day of DAYS) {
            await plan.populate({ path: day, select: 'title image cooking_time diet' });
        }

        const allRecipes = await Listing.find({}, 'title image cooking_time').sort({ createdAt: -1 });
        res.render("mealplan/index.ejs", { plan, allRecipes, DAYS });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
};

module.exports.addToDay = async (req, res) => {
    const { day, recipeId } = req.body;
    const wantsJSON = req.headers['accept'] && req.headers['accept'].includes('application/json');

    if (!DAYS.includes(day)) {
        if (wantsJSON) return res.status(400).json({ success: false, message: "Please select a valid day." });
        req.flash("error", "Please select a valid day.");
        return res.redirect("back");
    }

    try {
        let plan = await MealPlan.findOne({ user: req.user._id });
        if (!plan) plan = await MealPlan.create({ user: req.user._id });

        if (!plan[day].some(id => id.equals(recipeId))) {
            plan[day].push(recipeId);
            await plan.save();
        }

        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        if (wantsJSON) return res.json({ success: true, message: `Added to ${dayName}! 🗓️` });
        req.flash("success", `Recipe added to ${dayName}!`);
        res.redirect("/mealplan");
    } catch (err) {
        console.error(err);
        if (wantsJSON) return res.status(500).json({ success: false, message: "Could not add recipe. Try again." });
        req.flash("error", "Could not add recipe.");
        res.redirect("/mealplan");
    }
};

module.exports.removeFromDay = async (req, res) => {
    const { day, recipeId } = req.params;
    if (!DAYS.includes(day)) return res.status(400).json({ message: "Invalid day." });

    try {
        const plan = await MealPlan.findOne({ user: req.user._id });
        if (plan) {
            plan[day] = plan[day].filter(id => !id.equals(recipeId));
            await plan.save();
        }
        req.flash("success", "Recipe removed from planner.");
        res.redirect("/mealplan");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not remove recipe.");
        res.redirect("/mealplan");
    }
};

module.exports.clearPlanner = async (req, res) => {
    try {
        const update = {};
        DAYS.forEach(day => (update[day] = []));
        await MealPlan.findOneAndUpdate({ user: req.user._id }, update);
        req.flash("success", "Meal planner cleared.");
        res.redirect("/mealplan");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not clear planner.");
        res.redirect("/mealplan");
    }
};
