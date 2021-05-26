const Event = require("../Models/Event");
const User = require("../Models/User");
var fs = require("fs");

const getEventForHost = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.id;
  const idHost = req.user.idRole;
  Event.getEventByIdEventIdHost(idEvent, idHost, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({ result });
  });
};

const getEventForGuest = (req, res, next) => {
  if (req.user.role != 3) {
    return res.sendStatus(401);
  }
  const idEvent = req.user.idEvent;
  const idRole = req.user.idRole;
  Event.getEventDetailByIdEventIdGuest(idEvent, idRole, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({ result });
  });
};

const getAllEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idHost = req.user.idRole;
  Event.getAllEventByIdHost(idHost, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({ result });
  });
};

const getAllEventForCommittee = (req, res, next) => {
  if (req.user.role != 2) {
    return res.sendStatus(401);
  }
  const idCommittee = req.user.idRole;
  Event.getAllEventByIdCommittee(idCommittee, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({ result });
  });
};

const getAllAssignedCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.id;
  const idHost = req.user.idRole;
  Event.getEventById(idEvent, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length == 0) {
      return res.status(404).json({
        error: "No event found",
      });
    } else {
      Event.getAllCommitteeAssignedByIdHostId(
        idHost,
        idEvent,
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({ result });
        }
      );
    }
  });
};

const createEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const eventData = {
    eventTitle: req.body.eventTitle,
    eventSubTitle: req.body.eventSubTitle,
    eventDescription: req.body.eventDescription,
    eventHighlight: req.file.filename,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    coordinates: req.body.coordinates,
    primaryColor: req.body.primaryColor,
    secondaryColor: req.body.secondaryColor,
    accentColor: req.body.accentColor,
    textColor: req.body.textColor,
    max: req.body.max,
    idHost: req.user.idRole,
    idType: req.body.idType,
  };
  Event.addEvent(eventData, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Event.getEventById(result.insertId, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(201).json({
        message: `Event ${data[0].eventTitle} has been created.`,
      });
    });
  });
};

const deleteEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  const idHost = req.user.idRole;
  Event.getEventById(idEvent, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    fs.unlinkSync(`./public/images/${data[0].eventHighlight}`);
    User.deleteUserGuestByIdEvent(idEvent, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      Event.deleteEventById(idEvent, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        Event.getAllEventByIdHost(idHost, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({
            message: `Event ${data[0].eventTitle} has been deleted.`,
            result,
          });
        });
      });
    });
  });
};

const updateEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  let rawHighlightName = req.body.eventHighlightName;
  if (req.file) {
    fileName = req.file.filename;
  } else {
    let index = 0;
    if (rawHighlightName.indexOf(".png") !== -1) {
      index = rawHighlightName.indexOf(".png");
    } else if (rawHighlightName.indexOf(".jpeg") !== -1) {
      index = rawHighlightName.indexOf(".jpeg");
    } else {
      index = rawHighlightName.indexOf(".jpg");
    }
    const identifer = rawHighlightName.split("_");
    fileName =
      identifer[0] +
      "_" +
      identifer[1] +
      "_" +
      req.body.eventTitle.replace(" ", "") +
      rawHighlightName.substring(index, rawHighlightName.length);
    const dir = "./public/images/";
    fs.renameSync(dir + rawHighlightName, dir + fileName);
  }
  const idEvent = req.body.idEvent;
  const eventData = {
    eventTitle: req.body.eventTitle,
    eventSubTitle: req.body.eventSubTitle,
    eventDescription: req.body.eventDescription,
    eventHighlight: fileName,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    coordinates: req.body.coordinates,
    primaryColor: req.body.primaryColor,
    secondaryColor: req.body.secondaryColor,
    accentColor: req.body.accentColor,
    textColor: req.body.textColor,
    max: req.body.max,
    idType: req.body.idType,
  };
  Event.updateEvent(eventData, idEvent, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Event.getEventById(idEvent, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        message: `Event ${data[0].eventTitle} has been updated.`,
        result: {
          idEvent: data[0].idEvent,
          eventTitle: data[0].eventTitle,
          eventSubTitle: data[0].eventSubTitle,
          eventDescription: data[0].eventDescription,
          eventHighlight: data[0].eventHighlight,
          date: data[0].date,
          time: data[0].time,
          location: data[0].location,
          coordinates: data[0].coordinates,
          primaryColor: data[0].primaryColor,
          secondaryColor: data[0].secondaryColor,
          accentColor: data[0].accentColor,
          textColor: data[0].textColor,
          max: data[0].max,
          idType: data[0].idType,
        },
      });
    });
  });
};

const assignCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  const listOfIdCommittee = req.body.listOfCommittee;
  const idHost = req.user.idRole;
  Event.deleteCommitteeAssignedById(idEvent, (err) => {
    if (err) {
      return res(400).json({
        error: err.message,
      });
    }
    if (listOfIdCommittee.length != 0) {
      Event.addAssignCommittee(idEvent, listOfIdCommittee, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        Event.getEventById(idEvent, (err, data) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          Event.getAllCommitteeAssignedByIdHostId(
            idHost,
            idEvent,
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              return res.status(200).json({
                message: `Event ${data[0].eventTitle} has been assigned committees.`,
                result,
              });
            }
          );
        });
      });
    } else {
      Event.getEventById(idEvent, (err, data) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        Event.getAllCommitteeAssignedByIdHostId(
          idHost,
          idEvent,
          (err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            return res.status(200).json({
              message: `Event ${data[0].eventTitle} has been assigned committee.`,
              result,
            });
          }
        );
      });
    }
  });
};

module.exports = {
  getEventForHost,
  getEventForGuest,
  getAllEvent,
  getAllEventForCommittee,
  getAllAssignedCommittee,
  createEvent,
  deleteEvent,
  updateEvent,
  assignCommittee,
};
