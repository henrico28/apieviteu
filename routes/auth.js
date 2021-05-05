var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/AuthController");

router.post("/login", useController.login); // Validate Login Information for Host
router.post("/token", useController.refreshToken); // Refresh Token
router.post("/verify", useController.verifyToken); // Verify Token for Auto Login
router.delete("/logout", useController.logout); // Delete Refresh Token

module.exports = router;
