var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/CommitteeController");
var auth = require("../app/Controllers/AuthController");

router.get("/detail/:id", auth.authenticateToken, useController.getCommittee); // Get Committee
router.get("/lists", auth.authenticateToken, useController.getAllCommittee); // Get All Committee By IdEvent
router.get(
  "/lists/:id",
  auth.authenticateToken,
  useController.getAllCommitteeEvent
); // Get All Committee Of Event
router.get(
  "/assigned/:id",
  auth.authenticateToken,
  useController.getAllAssignedEvent
); // Get All Assigned Event
router.post("/create", auth.authenticateToken, useController.createCommittee); // Create Committee
router.post("/assign", auth.authenticateToken, useController.assignEvent); // Assign Event
router.delete("/delete", auth.authenticateToken, useController.deleteCommittee); // Delete Committee
router.put("/update", auth.authenticateToken, useController.updateCommittee); // Update Committee
router.put(
  "/activate",
  auth.authenticateToken,
  useController.activateCommittee
); // Activate Committee

module.exports = router;
