var express = require("express");
var router = express.Router();
var Event = require("../app/Models/Event");
var useController = require("../app/Controllers/EventController");
var auth = require("../app/Controllers/AuthController");
var path = require("path");
var fs = require("fs");
var multer = require("multer");

const DIR = "./public/images";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file) {
      cb(null, DIR);
    } else {
      cb(null, null);
    }
  },
  filename: (req, file, cb) => {
    if (req.body.eventHighlightName) {
      console.log("hello");
      if (!file) {
        const fileName = req.body.eventHighlightName;
        cb(null, fileName);
      } else {
        const rawHighlightName = req.body.eventHighlightName;
        let index = 0;
        if (rawHighlightName.indexOf(".png") !== -1) {
          index = rawHighlightName.indexOf(".png");
        } else if (rawHighlightName.indexOf(".jpeg") !== -1) {
          index = rawHighlightName.indexOf(".jpeg");
        } else {
          index = rawHighlightName.indexOf(".jpg");
        }
        const highlightName = rawHighlightName.substring(0, index);
        if (fs.existsSync(`./public/images/${highlightName}.png`)) {
          fs.unlinkSync(`./public/images/${highlightName}.png`);
        } else if (fs.existsSync(`./public/images/${highlightName}.jpeg`)) {
          fs.unlinkSync(`./public/images/${highlightName}.jpeg`);
        } else if (fs.existsSync(`./public/images/${highlightName}.jpg`)) {
          fs.unlinkSync(`./public/images/${highlightName}.jpg`);
        }
        const fileName = highlightName + path.extname(file.originalname);
        cb(null, fileName);
      }
    } else {
      const idUser = req.user.idUser;
      Event.getMaxIdEvent((err, result) => {
        if (err) {
          console.log("Err", err.message);
        } else {
          let idEvent = 1;
          if (result[0].maxIdEvent) {
            idEvent = result[0].maxIdEvent + 1;
          }
          const tmp =
            idUser + "_" + idEvent + "_" + req.body.eventTitle.replace(" ", "");
          if (fs.existsSync(`./public/images/${tmp}.png`)) {
            fs.unlinkSync(`./public/images/${tmp}.png`);
          } else if (fs.existsSync(`./public/images/${tmp}.jpeg`)) {
            fs.unlinkSync(`./public/images/${tmp}.jpeg`);
          } else if (fs.existsSync(`./public/images/${tmp}.jpg`)) {
            fs.unlinkSync(`./public/images/${tmp}.jpg`);
          }
          const fileName = tmp + path.extname(file.originalname);
          cb(null, fileName);
        }
      });
    }
  },
});

const uploads = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
});

router.get("/lists", auth.authenticateToken, useController.getAllEvent); //Get All Events
router.get(
  `/detail/:id`,
  auth.authenticateToken,
  useController.getEventForHost
); //Get Event For Host
router.get(
  "/information",
  auth.authenticateToken,
  useController.getEventForGuest
); //Get Event For Guest
router.delete("/delete", auth.authenticateToken, useController.deleteEvent); //Delete Event
router.post(
  "/create",
  auth.authenticateToken,
  uploads.single("eventHighlight"),
  useController.createEvent
); //Create Event
router.put(
  "/update",
  auth.authenticateToken,
  uploads.single("eventHighlight"),
  useController.updateEvent
); //Update Event
module.exports = router;
