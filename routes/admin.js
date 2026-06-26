const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/dashboard", isAdmin, wrapAsync(adminController.dashboard));

module.exports = router;
