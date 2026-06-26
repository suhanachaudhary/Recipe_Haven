const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const notificationController = require("../controllers/notification.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", isLoggedIn, wrapAsync(notificationController.getNotifications));
router.post("/:id/read", isLoggedIn, wrapAsync(notificationController.markAsRead));
router.post("/read-all", isLoggedIn, wrapAsync(notificationController.markAllRead));

module.exports = router;
