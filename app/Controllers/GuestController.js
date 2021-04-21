const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Guest = require("../Models/Guest");

const getGuest = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idGuest = req.params.id;
  const idHost = req.user.idRole;
  Guest.getGuestByIdGuestIdHost(idGuest, idHost, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
      return res.status(200).json({ result });
    }
  });
};

const getAllGuest = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.idEvent;
  const idHost = req.user.idRole;
  Guest.getAllGuestByIdHostIdEvent(idHost, idEvent, (err, result) => {
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

const createGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
  };
  const user = new User(userData);
  Guest.getGuestByUserEmail(userData.userEmail, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length >= 1) {
      if (data[0].userEmail === userData.userEmail) {
        return res.status(409).json({
          error: "Email already exists.",
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
          Guest.getGuestById(result.insertId, (err, data) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            return res.status(201).json({
              message: `Guest ${data[0].userName} has been added.`,
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
  const idUser = req.body.idUser;
  const idGuest = req.body.idGuest;
  const idEvent = req.body.idEvent;
  const idHost = req.user.idRole;
  Guest.getGuestById(idGuest, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    User.deleteUserByIdUser(idUser, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      Guest.getAllGuestByIdHostIdEvent(idHost, idEvent, (err, result) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          message: `Guest ${data[0].userName} has been deleted.`,
          result,
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
  const user = new User(userData);
  Guest.getGuestByUserEmailNotId(userData.userEmail, idGuest, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length >= 1) {
      if (data[0].userEmail === userData.userEmail) {
        return res.status(409).json({
          error: "Email already exists.",
        });
      }
    } else {
      user.updateUserNameEmail(idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        const guestData = {
          qty: req.body.qty,
          status: req.body.status,
          attend: req.body.attend,
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
              message: `Guest ${data[0].userName} has been updated.`,
              result: {
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
  if (req.user.role != 2 && req.user.role != 1) {
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
        message: `Guest ${data[0].userName} has attended.`,
      });
    });
  });
};

const inviteGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  try {
    const idGuest = req.body.idGuest;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.userPassword, salt);
    const userData = {
      userPassword: hashedPassword,
    };
    const guestData = {
      invited: 1,
    };
    const user = new User(userData);
    const guest = new Guest(guestData);
    Guest.getGuestByIdGuest(idGuest, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      user.updateUserPassword(data[0].idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        guest.updateGuestInvited(idGuest, (err) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({
            message: `${data[0].userName} have been invited`,
          });
        });
      });
    });
  } catch {
    return res.sendStatus(500);
  }
};

module.exports = {
  getGuest,
  getAllGuest,
  createGuest,
  deleteGuest,
  updateGuest,
  updateGuestRSVP,
  updateGuestAttend,
  inviteGuest,
};
