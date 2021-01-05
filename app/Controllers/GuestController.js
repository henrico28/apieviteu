const bcrypt = require("bcrypt");
const Guest = require("../Models/Guest");

const getAllGuest = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  Guest.getAllGuestByIdEvent(idEvent, (err, result) => {
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

const createGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.guestPassword, salt);
    const guestData = {
      guestName: req.body.guestName,
      guestEmail: req.body.guestEmail,
      guestPassword: hashedPassword,
      qty: 0,
      status: 0,
      invited: 0,
      attend: 0,
      idEvent: req.body.idEvent,
    };
    const guest = new Guest(guestData);
    Guest.getGuestByIdEventEmail(
      guestData.idEvent,
      guestData.guestEmail,
      (err, data) => {
        if (err) {
          return res.status(401).json({
            error: err.message,
          });
        }

        if (data.length >= 1) {
          if (data[0].guestEmail === guestData.guestEmail) {
            return res.status(409).json({
              message: "Email already exists",
            });
          }
        } else {
          guest.addGuest((err, result) => {
            if (err) {
              return res.status(401).json({
                error: err.message,
              });
            }

            Guest.getGuestById(result.insertId, (err, data) => {
              if (err) {
                return res.status(401).json({
                  error: err.message,
                });
              }
              return res.status(201).json({
                data: {
                  idGuest: data[0].idGuest,
                  guestName: data[0].guestName,
                  guestEmail: data[0].guestEmail,
                  qty: data[0].qty,
                  status: data[0].status,
                  invited: data[0].invited,
                  attend: data[0].attend,
                  idEvent: data[0].idEvent,
                },
              });
            });
          });
        }
      }
    );
  } catch {
    return res.sendStatus(500);
  }
};

const deleteGuest = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idGuest = req.body.idGuest;
  Guest.getGuestById(idGuest, (err, data) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(409).json({
        error: "Invalid Guest ID",
      });
    }
    Guest.deleteGuestById(idGuest, (err) => {
      if (err) {
        return res.status(409).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        message: `Guest ${data[0].guestName} Successfully Deleted`,
      });
    });
  });
};

const updateGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  try {
    const idGuest = req.body.idGuest;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.guestPassword, salt);
    const guestData = {
      guestName: req.body.guestName,
      guestEmail: req.body.guestEmail,
      guestPassword: hashedPassword,
      qty: req.body.qty,
      status: req.body.status,
      attend: req.body.attend,
      idEvent: req.body.idEvent,
    };
    const guest = new Guest(guestData);
    guest.updateGuest(idGuest, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      Guest.getGuestById(idGuest, (err, data) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          data: {
            idGuest: data[0].idGuest,
            guestName: data[0].guestName,
            guestEmail: data[0].guestEmail,
            qty: data[0].qty,
            status: data[0].status,
            attend: data[0].attend,
            idEvent: data[0].idEvent,
          },
        });
      });
    });
  } catch {
    return res.sendStatus(500);
  }
};

const updateGuestRSVP = (req, res, next) => {
  const idGuest = req.body.idGuest;
  const guestData = {
    qty: req.body.qty,
    status: req.body.status,
  };
  const guest = new Guest(guestData);
  guest.updateGuestRSVP(idGuest, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Guest.getGuestById(idGuest, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        data: {
          qty: data[0].qty,
          status: data[0].status,
        },
      });
    });
  });
};

const updateGuestAttend = (req, res, next) => {
  const idGuest = req.body.idGuest;
  const guestData = {
    attend: req.body.attend,
  };
  const guest = new Guest(guestData);
  guest.updateGuestAttend(idGuest, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Guest.getGuestById(idGuest, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        data: {
          attend: data[0].attend,
        },
      });
    });
  });
};

module.exports = {
  getAllGuest,
  createGuest,
  deleteGuest,
  updateGuest,
  updateGuestRSVP,
  updateGuestAttend,
};
