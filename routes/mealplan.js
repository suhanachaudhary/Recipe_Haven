const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const mealPlanController = require("../controllers/mealplan.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", isLoggedIn, wrapAsync(mealPlanController.showPlanner));
router.post("/add", isLoggedIn, wrapAsync(mealPlanController.addToDay));
router.post("/clear", isLoggedIn, wrapAsync(mealPlanController.clearPlanner));
router.post("/remove/:day/:recipeId", isLoggedIn, wrapAsync(mealPlanController.removeFromDay));

module.exports = router;
