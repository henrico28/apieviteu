const Announcement = require("../Models/Announcement");

const getAnnouncement = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idAnnouncement = req.params.id;
  const idHost = req.user.idRole;
  Announcement.getAnnouncementByIdAnnouncementIdHost(
    idAnnouncement,
    idHost,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({ result });
    }
  );
};

const getAllAnnouncement = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.id;
  const idHost = req.user.idRole;
  Announcement.getAllAnnouncementByIdHostIdEvent(
    idHost,
    idEvent,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      return res.status(200).json({
        result,
      });
    }
  );
};

const getPublishedAnnouncement = (req, res, next) => {
  if (req.user.role != 3) {
    return res.sendStatus(401);
  }
  const idAnnouncement = req.params.id;
  const idEvent = req.user.idEvent;
  const idGuest = req.user.idRole;
  Announcement.getAnnouncementByIdAnnouncementIdEventIdGuest(
    idAnnouncement,
    idEvent,
    idGuest,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      return res.status(200).json({
        result,
      });
    }
  );
};

const getAllPublishedAnnouncement = (req, res, next) => {
  if (req.user.role != 3) {
    return res.sendStatus(401);
  }
  const idEvent = req.user.idEvent;
  Announcement.getAllPublishedAnnoucementByIdEvent(idEvent, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      result,
    });
  });
};

const createAnnouncement = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const announcementData = {
    announcementTitle: req.body.announcementTitle,
    announcementDescription: req.body.announcementDescription,
    announcementStatus: req.body.announcementStatus,
    idEvent: req.body.idEvent,
  };
  const announcement = new Announcement(announcementData);
  announcement.addAnnouncement((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Announcement.getAnnouncementById(result.insertId, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(201).json({
        message: `Announcement ${data[0].announcementTitle} has been added.`,
      });
    });
  });
};

const deleteAnnouncement = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  const idAnnouncement = req.body.idAnnouncement;
  Announcement.getAnnouncementById(idAnnouncement, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Announcement.deleteAnnouncementById(idAnnouncement, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      Announcement.getAllAnnouncementByIdEvent(idEvent, (err, result) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          message: `Announcement ${data[0].announcementTitle} has been deleted.`,
          result,
        });
      });
    });
  });
};

const updateAnnoucement = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idAnnouncement = req.body.idAnnouncement;
  const announcementData = {
    announcementTitle: req.body.announcementTitle,
    announcementDescription: req.body.announcementDescription,
    announcementStatus: req.body.announcementStatus,
  };
  const announcement = new Announcement(announcementData);

  announcement.updateAnnoucement(idAnnouncement, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Announcement.getAnnouncementById(idAnnouncement, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        message: `Announcement ${data[0].announcementTitle} has been updated.`,
        result: {
          idAnnouncement: data[0].idAnnouncement,
          announcementTitle: data[0].announcementTitle,
          announcementDescription: data[0].announcementDescription,
          announcementStatus: data[0].announcementStatus,
          idEvent: data[0].idEvent,
        },
      });
    });
  });
};

const updateAnnoucementStatus = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  const idAnnouncement = req.body.idAnnouncement;
  const announcementData = {
    announcementStatus: req.body.announcementStatus,
  };
  const announcement = new Announcement(announcementData);
  Announcement.getAnnouncementById(idAnnouncement, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    announcement.updateAnnoucementStatus(idAnnouncement, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      Announcement.getAllAnnouncementByIdEvent(idEvent, (err, result) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          message: `Announcement ${data[0].announcementTitle} status has been change.`,
          result,
        });
      });
    });
  });
};

module.exports = {
  getAnnouncement,
  getPublishedAnnouncement,
  getAllAnnouncement,
  getAllPublishedAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnoucement,
  updateAnnoucementStatus,
};
