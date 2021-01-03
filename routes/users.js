var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/UserController");

router.get("/lists", useController.getAllUsers2); //Get All Users
router.post("/create", useController.createNewUser); //Create New User

module.exports = router;
