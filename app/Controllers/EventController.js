const Event = require("../Models/Event");

const getAllEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.user.idUser;
  if (idUser == undefined) {
    return res.sendStatus(401);
  }
  Event.getAllEventByIdUser(idUser, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({
      data: result,
    });
  });
};

const getEventForUser = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  Event.getEventById(idEvent, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({
      data: result,
    });
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
      data: result,
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
    eventHighlight: req.body.eventHighlight,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    eventPrimary: req.body.eventPrimary,
    eventSecondary: req.body.eventSecondary,
    eventAccent: req.body.eventAccent,
    max: req.body.max,
    idUser: req.body.idUser,
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
        data: {
          eventTitle: data[0].eventTitle,
          eventSubTitle: data[0].eventSubTitle,
          eventDescription: data[0].eventDescription,
          eventHighlight: data[0].eventHighlight,
          date: data[0].date,
          time: data[0].time,
          location: data[0].location,
          eventPrimary: data[0].eventPrimary,
          eventSecondary: data[0].eventSecondary,
          eventAccent: data[0].eventAccent,
          max: data[0].max,
          idUser: data[0].idUser,
          idType: data[0].idType,
        },
      });
    });
  });
};

const deleteEvent = (req, res, next) => {};

const updateEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  const eventData = {
    eventTitle: req.body.eventTitle,
    eventSubTitle: req.body.eventSubTitle,
    eventDescription: req.body.eventDescription,
    eventHighlight: req.body.eventHighlight,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
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
        data: {
          idEvent: data[0].idEvent,
          eventTitle: data[0].eventTitle,
          eventSubTitle: data[0].eventSubTitle,
          eventDescription: data[0].eventDescription,
          eventHighlight: data[0].eventHighlight,
          date: data[0].date,
          time: data[0].time,
          location: data[0].location,
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
  getEventForUser,
  getEventForGuest,
  createEvent,
  deleteEvent,
  updateEvent,
};
