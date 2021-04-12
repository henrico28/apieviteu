const Event = require("../Models/Event");

const getAllEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idHost = req.user.idRole;
  if (idHost == undefined) {
    return res.sendStatus(401);
  }
  Event.getAllEventByIdHost(idHost, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({
      result,
    });
  });
};

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
  Event.getEventById(idEvent, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({
      result,
    });
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
    eventPrimary: req.body.eventPrimary,
    eventSecondary: req.body.eventSecondary,
    eventAccent: req.body.eventAccent,
    max: req.body.max,
    idHost: req.user.idRole,
    idType: req.body.idType,
  };
  const event = new Event(eventData);
  event.addEvent((err, result) => {
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

const deleteEvent = (req, res, next) => {};

const updateEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  let fileName = req.body.eventHighlightName;
  if (req.file) {
    fileName = req.file.filename;
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
    eventPrimary: req.body.eventPrimary,
    eventSecondary: req.body.eventSecondary,
    eventAccent: req.body.eventAccent,
    max: req.body.max,
    idType: req.body.idType,
  };
  const event = new Event(eventData);
  event.updateEvent(idEvent, (err) => {
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
          eventPrimary: data[0].eventPrimary,
          eventSecondary: data[0].eventSecondary,
          eventAccent: data[0].eventAccent,
          max: data[0].max,
          idType: data[0].idType,
        },
      });
    });
  });
};

module.exports = {
  getAllEvent,
  getEventForHost,
  getEventForGuest,
  createEvent,
  deleteEvent,
  updateEvent,
};
