const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Committee = require("../Models/Committee");

const getAllCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  Committee.getAllCommitteeByIdEvent(idEvent, (err, result) => {
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

const createCommittee = async (req, res, next) => {
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
        const committeeData = {
          active: 0,
          idUser: result.insertId,
          idEvent: req.body.idEvent,
        };
        const committee = new Committee(committeeData);
        committee.addCommittee((err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          Committee.getCommitteeByIdCommittee(result.insertId, (err, data) => {
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
                idCommittee: data[0].idCommittee,
                active: data[0].active,
                idEvent: data[0].idEvent,
              },
            });
          });
        });
      });
    }
  });
};

const deleteCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idCommittee = req.body.idCommittee;
  Committee.getCommitteeByIdCommittee(idCommittee, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(409).json({
        error: "Invalid Committee ID",
      });
    }
    Committee.deleteCommitteeByIdCommittee(idCommittee, (err) => {
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
          message: `Committee ${data[0].userName} Successfully Deleted`,
        });
      });
    });
  });
};

const updateCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.body.idUser;
  const idCommittee = req.body.idCommittee;
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
      user.updateUserNameEmail(idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        Committee.getCommitteeByIdCommittee(idCommittee, (err, data) => {
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
              idCommittee: data[0].idCommittee,
              active: data[0].active,
              idEvent: data[0].idEvent,
            },
          });
        });
      });
    }
  });
};

const activateCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  try {
    const idCommittee = req.body.idCommittee;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.userPassword, salt);
    const userData = {
      userPassword: hashedPassword,
    };
    const committeeData = {
      active: 1,
    };
    const user = new User(userData);
    const committee = new Committee(committeeData);
    Committee.getCommitteeByIdCommittee(idCommittee, (err, data) => {
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
        committee.updateCommitteeActive(idCommittee, (err) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({
            message: `${data[0].userName} have been activated`,
          });
        });
      });
    });
  } catch {
    return res.sendStatus(500);
  }
};

module.exports = {
  getAllCommittee,
  createCommittee,
  deleteCommittee,
  updateCommittee,
  activateCommittee,
};
