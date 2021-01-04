var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/UserController");
var auth = require("../app/Controllers/AuthController");

router.get("/lists", auth.authenticateToken, useController.getAllUsers2); //Get All Users
router.post("/create", useController.createNewUser); //Create New User

module.exports = router;
