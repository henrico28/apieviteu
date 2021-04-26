const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Committee = require("../Models/Committee");
const Email = require("../Models/Email");
var domain = "sandboxadb05a97767742a688d70f7307af35cd.mailgun.org";
var mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: domain,
});
var MailComposer = require("nodemailer/lib/mail-composer");

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

const getAllAssignedEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idCommittee = req.params.id;
  Committee.getCommitteeById(idCommittee, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length == 0) {
      return res.status(400).json({
        error: "No committee found",
      });
    } else {
      Committee.getAllAssignedEventById(idCommittee, (err, result) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({ result });
      });
    }
  });
};

const createCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idHost = req.user.idRole;
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
  };
  const user = new User(userData);
  Committee.getCommitteeByUserEmailIdHost(
    userData.userEmail,
    idHost,
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
    }
  );
};

const deleteCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.body.idUser;
  const idCommittee = req.body.idCommittee;
  const idHost = req.user.idRole;
  Committee.getCommitteeById(idCommittee, (err, data) => {
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
};

const updateCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.body.idUser;
  const idCommittee = req.body.idCommittee;
  const idHost = req.user.idRole;
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
  };
  const user = new User(userData);
  Committee.getCommitteeByUserEmailIdHostNotId(
    userData.userEmail,
    idHost,
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
          committe.updateCommitteeActive(idCommittee, (err) => {
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

const assignEvent = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idCommittee = req.body.idCommittee;
  const listOfIdEvent = req.body.listOfEvent;
  Committee.deleteEventAssignedById(idCommittee, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (listOfIdEvent.length != 0) {
      Committee.addAssignEvent(idCommittee, listOfIdEvent, (err) => {
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
          Committee.getAllAssignedEventById(idCommittee, (err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            return res.status(200).json({
              message: `Committee ${data[0].userName} has been assigned events.`,
              result,
            });
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
  const idUser = req.body.idUser;
  const idCommittee = req.body.idCommittee;
  const idHost = req.user.idRole;
  try {
    const password = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      userPassword: hashedPassword,
    };
    const user = new User(userData);
    user.updateUserPassword(idUser, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      const committeeData = {
        active: 1,
      };
      const committee = new Committee(committeeData);
      committee.updateCommitteeActive(idCommittee, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        Committee.getCommitteeEmailDetailById(idCommittee, (err, data) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          let tokenContent = {
            idUser: data[0].idUser,
            email: data[0].userEmail,
            role: 2,
            idRole: data[0].idCommittee,
          };
          const verificationToken = jwt.sign(
            tokenContent,
            process.env.VERIFICATION_TOKEN_SECRET
          );
          let credentials = {
            email: data[0].userEmail,
            password: password,
            token: verificationToken,
          };
          let emailData = {
            detail: data[0],
            credentials: credentials,
          };
          const email = new Email(emailData);
          const emailContent = email.generateCommitteeEmail();
          let mailOptions = {
            from: data[0].hostEmail,
            to: data[0].userEmail,
            subject: "Committee Account Activation",
            text: "Committee Account Activation",
            html: emailContent,
          };
          let mail = new MailComposer(mailOptions);
          mail.compile().build((err, message) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            let dataToSend = {
              to: data[0].userEmail,
              message: message.toString("ascii"),
            };
            mailgun.messages().sendMime(dataToSend, (sendError, body) => {
              if (sendError) {
                return res.status(400).json({ error: sendError });
              }
              Committee.getAllCommitteeByIdHost(idHost, (err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: err.message,
                  });
                }
                return res.status(200).json({
                  message: `Committee ${data[0].userName} has been activated.`,
                  result,
                  body,
                });
              });
            });
          });
        });
      });
    });
  } catch {
    return res.sendStatus(500);
  }
};

module.exports = {
  getCommittee,
  getAllCommittee,
  getAllCommitteeEvent,
  getAllAssignedEvent,
  createCommittee,
  deleteCommittee,
  updateCommittee,
  assignEvent,
  activateCommittee,
};
