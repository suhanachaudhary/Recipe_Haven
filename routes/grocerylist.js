const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const groceryController = require("../controllers/grocerylist.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", isLoggedIn, wrapAsync(groceryController.showGrocery));
router.post("/generate", isLoggedIn, wrapAsync(groceryController.generateList));
router.post("/:id/item/:itemId/toggle", isLoggedIn, wrapAsync(groceryController.toggleItem));
router.post("/:id/delete", isLoggedIn, wrapAsync(groceryController.deleteList));

module.exports = router;
