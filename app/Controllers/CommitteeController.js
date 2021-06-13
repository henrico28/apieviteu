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
  const idHost = req.user.idRole;
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
      Committee.getAllAssignedEventByIdHostId(
        idHost,
        idCommittee,
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({ result });
        }
      );
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
        User.addUserNoPassword(userData, (err, result) => {
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
          Committee.addCommittee(committeeData, (err, result) => {
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
    userPassword: null,
  };
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
        User.updateUser(userData, idUser, (err) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          const committeData = {
            active: 0,
          };
          Committee.updateCommitteeActive(committeData, idCommittee, (err) => {
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
  const idHost = req.user.idRole;
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
          Committee.getAllAssignedEventByIdHostId(
            idHost,
            idCommittee,
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              return res.status(200).json({
                message: `Committee ${data[0].userName} has been assigned events.`,
                result,
              });
            }
          );
        });
      });
    } else {
      Committee.getCommitteeById(idCommittee, (err, data) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        Committee.getAllAssignedEventByIdHostId(
          idHost,
          idCommittee,
          (err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            return res.status(200).json({
              message: `Committee ${data[0].userName} has been assigned events.`,
              result,
            });
          }
        );
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
    User.updateUserPassword(userData, idUser, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      const committeeData = {
        active: 1,
      };
      Committee.updateCommitteeActive(committeeData, idCommittee, (err) => {
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
          const tokenContent = {
            idUser: data[0].idUser,
            email: data[0].userEmail,
            password: password,
            role: 2,
            idRole: data[0].idCommittee,
          };
          const verificationToken = jwt.sign(
            tokenContent,
            process.env.VERIFICATION_TOKEN_SECRET
          );
          const credentials = {
            email: data[0].userEmail,
            password: password,
            token: verificationToken,
          };
          const emailData = {
            detail: data[0],
            credentials: credentials,
          };
          const emailContent = Email.generateCommitteeEmail(emailData);
          const mailOptions = {
            from: data[0].hostEmail,
            to: data[0].userEmail,
            subject: "Committee Account Activation",
            text: "Committee Account Activation",
            html: emailContent,
          };
          mailgun.messages().send(mailOptions, (error, body) => {
            if (error) {
              return res.status(400).json({
                error: error.message,
              });
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
  } catch {
    return res.sendStatus(500);
  }
};

const activateAllCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idHost = req.user.idRole;
  Committee.getAllUnactiveCommitteeByIdHost(idHost, async (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length !== 0) {
      await data.forEach(async (committee, idx, array) => {
        try {
          const password = Math.random().toString(36).slice(-8);
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(password, salt);
          const userData = {
            userPassword: hashedPassword,
          };
          User.updateUserPassword(userData, committee.idUser, (err) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            const committeeData = {
              active: 1,
            };
            Committee.updateCommitteeActive(
              committeeData,
              committee.idCommittee,
              (err) => {
                if (err) {
                  return res.status(400).json({
                    error: err.message,
                  });
                }
                const tokenContent = {
                  idUser: committee.idUser,
                  email: committee.userEmail,
                  password: password,
                  role: 2,
                  idRole: committee.idCommittee,
                };
                const verificationToken = jwt.sign(
                  tokenContent,
                  process.env.VERIFICATION_TOKEN_SECRET
                );
                const credentials = {
                  email: committee.userEmail,
                  password: password,
                  token: verificationToken,
                };
                const emailData = {
                  detail: data[0],
                  credentials: credentials,
                };
                const emailContent = Email.generateCommitteeEmail(emailData);
                const mailOptions = {
                  from: committee.hostEmail,
                  to: committee.userEmail,
                  subject: "Committee Account Activation",
                  text: "Committee Account Activation",
                  html: emailContent,
                };
                mailgun.messages().send(mailOptions, (error, body) => {
                  if (error) {
                    return res.status(400).json({
                      error: error.message,
                    });
                  }
                  if (idx === array.length - 1) {
                    Committee.getAllCommitteeByIdHost(idHost, (err, result) => {
                      if (err) {
                        return res.status(400).json({
                          error: err.message,
                        });
                      }
                      return res.status(200).json({
                        message: "All committee has been activated.",
                        result,
                        body,
                      });
                    });
                  }
                });
              }
            );
          });
        } catch {
          return res.sendStatus(500);
        }
      });
    } else {
      Committee.getAllCommitteeByIdHost(idHost, (err, result) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          message: "All committee has been activated",
          result,
        });
      });
    }
  });
};

const deactivateCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.body.idUser;
  const idCommittee = req.body.idCommittee;
  const idHost = req.user.idRole;
  const userData = {
    userPassword: null,
  };
  Committee.getCommitteeById(idCommittee, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    User.updateUserPassword(userData, idUser, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      const committeeData = {
        active: 0,
      };
      Committee.updateCommitteeActive(committeeData, idCommittee, (err) => {
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
            message: `Committee ${data[0].userName} has been deactivated.`,
            result,
          });
        });
      });
    });
  });
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
  activateAllCommittee,
  deactivateCommittee,
};
