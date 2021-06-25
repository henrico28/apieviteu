var express = require("express");
var router = express.Router();
var useController = require("../app/Controllers/HostController");

router.get("/lists", useController.getAllHost);
router.post("/create", useController.createHost);

module.exports = router;
