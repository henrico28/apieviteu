var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/CommitteeController");
var auth = require("../app/Controllers/AuthController");

router.post("/lists", auth.authenticateToken, useController.getAllCommittee); //Get All Committee By IdEvent
router.post("/create", auth.authenticateToken, useController.createCommittee); //Create Committee
router.delete("/delete", auth.authenticateToken, useController.deleteCommittee); //Delete Committee
router.put("/update", auth.authenticateToken, useController.updateCommittee); //Update Committee
module.exports = router;
