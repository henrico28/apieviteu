const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Guest = require("../Models/Guest");
const Event = require("../Models/Event");
const Email = require("../Models/Email");
var domain = "sandboxadb05a97767742a688d70f7307af35cd.mailgun.org";
var mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: domain,
});

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
    }
    return res.status(200).json({ result });
  });
};

const getAllGuest = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.id;
  const idHost = req.user.idRole;
  Guest.getAllGuestByIdHostIdEvent(idHost, idEvent, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({ result });
  });
};

const getAllAttendedGuest = (req, res, next) => {
  if (req.user.role != 1 && req.user.role != 2) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.id;
  const idRole = req.user.idRole;
  if (req.user.role === 1) {
    Event.getEventByIdEventIdHost(idEvent, idRole, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      if (data.length === 0) {
        return res.status(404).json({
          error: "No event found",
        });
      } else {
        Guest.getAllAttendedGuestByIdEvent(idEvent, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({ result });
        });
      }
    });
  } else {
    Event.getEventManageByCommittee(idEvent, idRole, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      if (data.length === 0) {
        return res.status(404).json({
          error: "No event found",
        });
      } else {
        Guest.getAllAttendedGuestByIdEvent(idEvent, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({ result });
        });
      }
    });
  }
};

const getGuestAttendance = (req, res, next) => {
  if (req.user.role != 1 && req.user.role != 2) {
    return res.sendStatus(401);
  }
  const idEvent = req.params.id;
  const idRole = req.user.idRole;
  if (req.user.role === 1) {
    Event.getEventByIdEventIdHost(idEvent, idRole, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      if (data.length === 0) {
        return res.status(404).json({
          error: "No event found",
        });
      } else {
        Guest.getAllGuestByIdEvent(idEvent, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({ result });
        });
      }
    });
  } else {
    Event.getEventManageByCommittee(idEvent, idRole, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      if (data.length === 0) {
        return res.status(404).json({
          error: "No event found",
        });
      } else {
        Guest.getAllGuestByIdEvent(idEvent, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({ result });
        });
      }
    });
  }
};

const createGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
  };
  Guest.getGuestByUserEmailIdEvent(userData.userEmail, idEvent, (err, data) => {
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
        const guestData = {
          qty: 0,
          status: 0,
          invited: 0,
          attend: 0,
          idUser: result.insertId,
          idEvent: req.body.idEvent,
        };
        Guest.addGuest(guestData, (err, result) => {
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
  const idEvent = req.body.idEvent;
  const userData = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPassword: null,
  };
  Guest.getGuestByUserEmailIdEventNotId(
    userData.userEmail,
    idEvent,
    idGuest,
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
          const guestData = {
            qty: req.body.qty,
            status: req.body.status,
            invited: 0,
            attend: req.body.attend,
          };
          Guest.updateGuest(guestData, idGuest, (err) => {
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
    }
  );
};

const updateGuestRSVP = (req, res, next) => {
  if (req.user.role != 3) {
    return res.sendStatus(401);
  }
  const idGuest = req.user.idRole;
  const guestData = {
    qty: req.body.qty,
    status: req.body.status,
  };
  Guest.updateGuestRSVP(guestData, idGuest, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json({
      message: "You have successfully rsvpe'd.",
    });
  });
};

const updateGuestAttend = (req, res, next) => {
  if (req.user.role != 2 && req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idGuest = req.body.idGuest;
  const idEvent = req.body.idEvent;
  const guestData = {
    attend: req.body.attend,
  };
  Guest.getGuestByIdEventId(idEvent, idGuest, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(404).json({
        error: `Invalid guest information.`,
      });
    } else {
      Guest.updateGuestAttend(guestData, idGuest, (err) => {
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
          Guest.getAllGuestByIdEvent(idEvent, (err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            return res.status(200).json({
              message: `Guest ${data[0].userName} attendance has been updated.`,
              result,
            });
          });
        });
      });
    }
  });
};

const inviteGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.body.idUser;
  const idGuest = req.body.idGuest;
  const idHost = req.user.idRole;
  const idEvent = req.body.idEvent;
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
      const guestData = {
        invited: 1,
      };
      Guest.updateGuestInvited(guestData, idGuest, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        Guest.getGuestEmailDetailById(idGuest, (err, data) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          const tokenContent = {
            idUser: data[0].idUser,
            email: data[0].userEmail,
            password: password,
            role: 3,
            idRole: data[0].idGuest,
            idEvent: idEvent,
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
          const emailContent = Email.generateGuestEmail(emailData);
          const mailOptions = {
            from: data[0].hostEmail,
            to: data[0].userEmail,
            subject: `Invitation to ${data[0].eventTitle} - ${data[0].eventSubTitle}`,
            text: `Invitation to ${data[0].eventTitle} - ${data[0].eventSubTitle}`,
            html: emailContent,
          };
          mailgun.messages().send(mailOptions, (error, body) => {
            if (error) {
              return res.status(400).json({
                error: error,
              });
            }
            Guest.getAllGuestByIdHostIdEvent(idHost, idEvent, (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              return res.status(200).json({
                message: `Guest ${data[0].userName} has been invited.`,
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

const inviteAllGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  const idHost = req.user.idRole;
  Guest.getAllUnivitedGuestByIdHostIdEvent(
    idHost,
    idEvent,
    async (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      if (data.length !== 0) {
        await data.forEach(async (guest, idx, array) => {
          try {
            const password = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const userData = {
              userPassword: hashedPassword,
            };
            User.updateUserPassword(userData, guest.idUser, (err) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              const guestData = {
                invited: 1,
              };
              Guest.updateGuestInvited(guestData, guest.idGuest, (err) => {
                if (err) {
                  return res.status(400).json({
                    error: err.message,
                  });
                }
                const tokenContent = {
                  idUser: guest.idUser,
                  email: guest.userEmail,
                  password: password,
                  role: 3,
                  idRole: guest.idGuest,
                  idEvent: idEvent,
                };
                const verificationToken = jwt.sign(
                  tokenContent,
                  process.env.VERIFICATION_TOKEN_SECRET
                );
                const credentials = {
                  email: guest.userEmail,
                  password: password,
                  token: verificationToken,
                };
                const emailData = {
                  detail: data[0],
                  credentials: credentials,
                };
                const emailContent = Email.generateGuestEmail(emailData);
                const mailOptions = {
                  from: guest.hostEmail,
                  to: guest.userEmail,
                  subject: `Invitation to ${guest.eventTitle} - ${guest.eventSubTitle}`,
                  text: `Invitation to ${guest.eventTitle} - ${guest.eventSubTitle}`,
                  html: emailContent,
                };
                mailgun.messages().send(mailOptions, (error, body) => {
                  if (error) {
                    return res.status(400).json({
                      error: error,
                    });
                  }
                  if (idx === array.length - 1) {
                    Guest.getAllGuestByIdHostIdEvent(
                      idHost,
                      idEvent,
                      (err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error: err.message,
                          });
                        }
                        return res.status(200).json({
                          message: "All guest has been invited.",
                          result,
                        });
                      }
                    );
                  }
                });
              });
            });
          } catch {
            return res.sendStatus(500);
          }
        });
      } else {
        Guest.getAllGuestByIdHostIdEvent(idHost, idEvent, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({
            message: "All guest has been invited.",
            result,
          });
        });
      }
    }
  );
};

const uninviteGuest = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idUser = req.body.idUser;
  const idGuest = req.body.idGuest;
  const idEvent = req.body.idEvent;
  const idHost = req.user.idRole;
  const userData = {
    userPassword: null,
  };
  Guest.getGuestById(idGuest, (err, data) => {
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
      const guestData = {
        invited: 0,
      };
      Guest.updateGuestInvited(guestData, idGuest, (err) => {
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
            message: `Guest ${data[0].userName} has been uninvited.`,
            result,
          });
        });
      });
    });
  });
};

module.exports = {
  getGuest,
  getAllGuest,
  getAllAttendedGuest,
  getGuestAttendance,
  createGuest,
  deleteGuest,
  updateGuest,
  updateGuestRSVP,
  updateGuestAttend,
  inviteGuest,
  inviteAllGuest,
  uninviteGuest,
};
