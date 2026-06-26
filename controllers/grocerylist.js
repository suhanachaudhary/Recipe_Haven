const GroceryList = require("../models/grocerylist");
const Listing = require("../models/listing");
const MealPlan = require("../models/mealplan");

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

module.exports.showGrocery = async (req, res) => {
    try {
        const lists = await GroceryList.find({ user: req.user._id })
            .populate('recipes', 'title')
            .sort({ createdAt: -1 });

        const allRecipes = await Listing.find({}, 'title').sort({ createdAt: -1 });
        res.render("grocery/index.ejs", { lists, allRecipes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
};

module.exports.generateList = async (req, res) => {
    try {
        const { recipeIds, listName, fromMealPlan } = req.body;

        let ids = [];

        if (fromMealPlan === 'true') {
            const plan = await MealPlan.findOne({ user: req.user._id });
            if (plan) {
                DAYS.forEach(day => {
                    if (plan[day]) ids.push(...plan[day].map(id => id.toString()));
                });
            }
            ids = [...new Set(ids)];
        } else {
            ids = Array.isArray(recipeIds) ? recipeIds : recipeIds ? [recipeIds] : [];
        }

        if (ids.length === 0) {
            req.flash("error", "Please select at least one recipe.");
            return res.redirect("/grocery");
        }

        const recipes = await Listing.find({ _id: { $in: ids } });

        const ingredientMap = new Map();
        for (const recipe of recipes) {
            for (const raw of recipe.ingredients) {
                const parts = raw.split(/,|;|\n/).map(s => s.trim()).filter(Boolean);
                for (const part of parts) {
                    const key = part.toLowerCase();
                    if (!ingredientMap.has(key)) {
                        ingredientMap.set(key, part);
                    }
                }
            }
        }

        const items = Array.from(ingredientMap.values()).map(ingredient => ({ ingredient, checked: false }));

        const newList = await GroceryList.create({
            user: req.user._id,
            name: listName || 'My Grocery List',
            items,
            recipes: ids,
        });

        req.flash("success", "Grocery list generated!");
        res.redirect("/grocery");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not generate grocery list.");
        res.redirect("/grocery");
    }
};

module.exports.toggleItem = async (req, res) => {
    try {
        const list = await GroceryList.findOne({ _id: req.params.id, user: req.user._id });
        if (!list) return res.status(404).json({ message: "List not found." });

        const item = list.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: "Item not found." });

        item.checked = !item.checked;
        await list.save();

        res.json({ checked: item.checked });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
};

module.exports.deleteList = async (req, res) => {
    try {
        await GroceryList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        req.flash("success", "Grocery list deleted.");
        res.redirect("/grocery");
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not delete list.");
        res.redirect("/grocery");
    }
};
