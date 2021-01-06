const Announcement = require("../Models/Announcement");

const getAllAnnouncement = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  Announcement.getAllAnnouncementByIdEvent(idEvent, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      data: result,
    });
  });
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
      data: result,
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
        data: {
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

const deleteAnnouncement = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idAnnouncement = req.body.idAnnouncement;
  Announcement.getAnnouncementById(idAnnouncement, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(409).json({
        error: "Invalid Announcement ID",
      });
    }
    Announcement.deleteAnnouncementById(idAnnouncement, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        message: `Announcement ${data[0].announcementTitle} Successfully Deleted`,
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
        idAnnouncement: data[0].idAnnouncement,
        announcementTitle: data[0].announcementTitle,
        announcementDescription: data[0].announcementDescription,
        announcementStatus: data[0].announcementStatus,
      });
    });
  });
};

const updateAnnoucementStatus = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idAnnouncement = req.body.idAnnouncement;
  const announcementData = {
    announcementStatus: req.body.announcementStatus,
  };
  const announcement = new Announcement(announcementData);
  announcement.updateAnnoucementStatus(idAnnouncement, (err) => {
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
        idAnnouncement: data[0].idAnnouncement,
        announcementStatus: data[0].announcementStatus,
      });
    });
  });
};

module.exports = {
  getAllAnnouncement,
  getAllPublishedAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnoucement,
  updateAnnoucementStatus,
};
