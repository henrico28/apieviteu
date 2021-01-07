var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/InviteController");
var auth = require("../app/Controllers/AuthController");

router.post("/lists", auth.authenticateToken, useController.getInvite); //Get Invite By IdEvent
router.post("/create", auth.authenticateToken, useController.createInvite); //Create Invite
router.put("/update", auth.authenticateToken, useController.updateInvite); //Update Invite
module.exports = router;
