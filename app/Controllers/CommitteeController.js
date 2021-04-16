const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Committee = require("../Models/Committee");

const getAllCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idHost = req.user.idRole;
  Committee.getAllCommitteeByIdHost(idHost, (err, result) => {
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

const getAllCommitteeEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.id;
  Committee.getCommitteeByIdEvent(idEvent, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({ result });
  });
};

const getCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idCommittee = req.params.id;
  const idHost = req.user.idRole;
  Committee.getCommitteeByIdCommitteeIdHost(
    idCommittee,
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

const createCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
  };
  const user = new User(userData);
  Committee.getCommitteeByUserEmail(userData.userEmail, (err, data) => {
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
        const committeeData = {
          active: 0,
          idUser: result.insertId,
          idHost: req.user.idRole,
        };
        const committee = new Committee(committeeData);
        committee.addCommittee((err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          Committee.getCommitteeById(result.insertId, (err, data) => {
            if (err) {
              return res.status(400).json({ error: err.message });
            }
            return res.status(201).json({
              message: `Committee ${data[0].userName} has been added.`,
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
  const idHost = req.user.idRole;
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
        Committee.getAllCommitteeByIdHost(idHost, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({
            message: `Committee ${data[0].userName} has been deleted.`,
            result,
          });
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
  Committee.getCommitteeByUserEmailNotId(
    userData.userEmail,
    idCommittee,
    (err, data) => {
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
          const committeData = {
            active: 0,
          };
          const committe = new Committee(committeData);
          committe.updateCommitteeActive(idCommittee, (err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            Committee.getCommitteeById(idCommittee, (err, data) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              return res.status(200).json({
                message: `Committee ${data[0].userName} has been updated.`,
                result: {
                  idUser: data[0].idUser,
                  userName: data[0].userName,
                  userEmail: data[0].userEmail,
                  idCommittee: data[0].idCommittee,
                  active: data[0].active,
                  idHost: data[0].idHost,
                },
              });
            });
          });
        });
      }
    }
  );
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
  getAllCommitteeEvent,
  getCommittee,
  createCommittee,
  deleteCommittee,
  updateCommittee,
  activateCommittee,
};
