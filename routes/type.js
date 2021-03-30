var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/TypeController");
var auth = require("../app/Controllers/AuthController");

router.get("/lists", auth.authenticateToken, useController.getAllType); // Get All Type

module.exports = router;
