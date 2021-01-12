const User = require("../Models/User");
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
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
  };
  const user = new User(userData);
  User.getUserByEmail(userData.userEmail, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length >= 1) {
      if (data[0].userEmail === userData.userEmail) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    } else {
      user.addUserNoPassword((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        const guestData = {
          qty: 0,
          status: 0,
          invited: 0,
          attend: 0,
          idUser: result.insertId,
          idEvent: req.body.idEvent,
        };
        const guest = new Guest(guestData);
        guest.addGuest((err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          Guest.getGuestByIdGuest(result.insertId, (err, data) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            return res.status(201).json({
              data: {
                idUser: data[0].idUser,
                userName: data[0].userName,
                userEmail: data[0].userEmail,
                idGuest: data[0].idGuest,
                qty: data[0].qty,
                status: data[0].status,
                invited: data[0].invited,
                attend: data[0].attend,
                idEvent: data[0].idEvent,
              },
            });
          });
        });
      });
    }
  });
};

const deleteGuest = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idGuest = req.body.idGuest;
  Guest.getGuestByIdGuest(idGuest, (err, data) => {
    if (err) {
      return res.status(400).json({
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
        return res.status(400).json({
          error: err.message,
        });
      }
      User.deleteUserByIdUser(data[0].idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          message: `Guest ${data[0].userName} Successfully Deleted`,
        });
      });
    });
  });
};

const updateGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.body.idUser;
  const idGuest = req.body.idGuest;
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
  };
  const guestData = {
    qty: req.body.qty,
    status: req.body.status,
    attend: req.body.attend,
  };
  const user = new User(userData);
  const guest = new Guest(guestData);
  User.getUserByEmail(userData.userEmail, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length >= 1) {
      if (data[0].userEmail === userData.userEmail) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    } else {
      user.updateUserNameEmail(idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        guest.updateGuest(idGuest, (err) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          Guest.getGuestByIdGuest(idGuest, (err, data) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            return res.status(200).json({
              data: {
                idUser: data[0].idUser,
                userName: data[0].userName,
                userEmail: data[0].userEmail,
                idGuest: data[0].idGuest,
                qty: data[0].qty,
                status: data[0].status,
                attend: data[0].attend,
              },
            });
          });
        });
      });
    }
  });
};

const updateGuestRSVP = (req, res, next) => {
  if (req.user.role != 3) {
    return res.sendStatus(401);
  }
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
    Guest.getGuestByIdGuest(idGuest, (err, data) => {
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
  if (req.user.role != 2) {
    return res.sendStatus(401);
  }
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
