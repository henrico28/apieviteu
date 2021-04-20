var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/AnnouncementController");
var auth = require("../app/Controllers/AuthController");

router.get(
  "/publishedLists",
  auth.authenticateToken,
  useController.getAllPublishedAnnouncement
); // Get All Published Announcement By Id Event
router.get(
  "/detail/:id",
  auth.authenticateToken,
  useController.getAnnouncement
); // Get Announcement
router.get(
  "/lists/:id",
  auth.authenticateToken,
  useController.getAllAnnouncement
); // Get All Announcement By IdEvent
router.post(
  "/create",
  auth.authenticateToken,
  useController.createAnnouncement
); // Create Announcement
router.delete(
  "/delete",
  auth.authenticateToken,
  useController.deleteAnnouncement
); // Delete Announcement
router.put("/update", auth.authenticateToken, useController.updateAnnoucement); // Update Announcement
router.put(
  "/publish",
  auth.authenticateToken,
  useController.updateAnnoucementStatus
); // Update Announcement Status

module.exports = router;
