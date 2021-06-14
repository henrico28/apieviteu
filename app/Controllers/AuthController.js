const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Host = require("../Models/Host");
const Guest = require("../Models/Guest");
const Committee = require("../Models/Committee");

const login = async (req, res, next) => {
  const loginData = {
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
  };
  Host.getHostByUserEmail(loginData.userEmail, async (err, host) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    let verifyHost = false;
    if (host.length !== 0) {
      verifyHost = await bcrypt.compare(
        loginData.userPassword,
        host[0].userPassword
      );
    }
    if (host.length === 0 || !verifyHost) {
      Committee.getCommitteeByUserEmail(
        loginData.userEmail,
        async (err, committee) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          let committeeData = null;
          if (committee.length !== 0) {
            for (let i = 0; i < committee.length; i++) {
              let validate = await bcrypt.compare(
                loginData.userPassword,
                committee[i].userPassword
              );
              if (validate) {
                committeeData = committee[i];
                break;
              }
            }
          }
          if (committee.length === 0 || !committeeData) {
            Guest.getGuestByUserEmail(
              loginData.userEmail,
              async (err, guest) => {
                if (err) {
                  return res.status(400).json({
                    error: err.message,
                  });
                }
                if (guest.length === 0) {
                  return res.status(401).json({
                    error: "Invalid email or password.",
                  });
                } else {
                  let guestData = null;
                  for (let i = 0; i < guest.length; i++) {
                    let validate = await bcrypt.compare(
                      loginData.userPassword,
                      guest[i].userPassword
                    );
                    if (validate) {
                      guestData = guest[i];
                      break;
                    }
                  }
                  if (!guestData) {
                    return res.status(401).json({
                      error: "Invalid email or password.",
                    });
                  } else {
                    let tokenContent = {
                      idUser: guestData.idUser,
                      email: guestData.userEmail,
                      name: guestData.userName,
                      role: 3,
                      idRole: guestData.idGuest,
                      idEvent: guestData.idEvent,
                    };
                    const accessToken = generateAccessToken(tokenContent);
                    const refreshToken = jwt.sign(
                      tokenContent,
                      process.env.REFRESH_TOKEN_SECRET
                    );
                    const userData = {
                      token: refreshToken,
                    };
                    User.updateUserToken(userData, guestData.idUser, (err) => {
                      if (err) {
                        return res.status(400).json({
                          error: err.message,
                        });
                      }
                      return res.status(200).json({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        name: guestData.userName,
                        role: 3,
                      });
                    });
                  }
                }
              }
            );
          } else {
            let tokenContent = {
              idUser: committeeData.idUser,
              email: committeeData.userEmail,
              role: 2,
              idRole: committeeData.idCommittee,
            };
            const accessToken = generateAccessToken(tokenContent);
            const refreshToken = jwt.sign(
              tokenContent,
              process.env.REFRESH_TOKEN_SECRET
            );
            const userData = {
              token: refreshToken,
            };
            User.updateUserToken(userData, committeeData.idUser, (err) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              return res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                name: committeeData.userName,
                role: 2,
              });
            });
          }
        }
      );
    } else {
      let tokenContent = {
        idUser: host[0].idUser,
        email: host[0].userEmail,
        role: 1,
        idRole: host[0].idHost,
      };
      const accessToken = generateAccessToken(tokenContent);
      const refreshToken = jwt.sign(
        tokenContent,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userData = {
        token: refreshToken,
      };
      User.updateUserToken(userData, host[0].idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          name: host[0].userName,
          role: 1,
        });
      });
    }
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    req.user = user;
    next();
  });
};

const refreshToken = (req, res, next) => {
  const email = req.body.userEmail;
  const refreshToken = req.body.refreshToken;
  if (email == null || refreshToken == null) return res.sendStatus(401);
  User.getUserByEmailToken(email, refreshToken, (err, result) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(401).json({
        error: "Invalid email or token.",
      });
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            return res.status(403).json({
              error: err.message,
            });
          }
          if (user.email !== email) {
            return res.sendStatus(403);
          }
          let tokenContent = {
            idUser: user.idUser,
            email: user.email,
            role: user.role,
            idRole: user.idRole,
            idEvent: user.idEvent,
          };
          const accessToken = generateAccessToken(tokenContent);
          return res.status(200).json({
            accessToken: accessToken,
          });
        }
      );
    }
  });
};

const logout = (req, res, next) => {
  const email = req.body.userEmail;
  const refreshToken = req.body.refreshToken;
  User.getUserByEmailToken(email, refreshToken, (err, data) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(409).json({
        error: "Invalid email or token.",
      });
    } else {
      const userData = {
        token: null,
      };
      User.updateUserToken(userData, data[0].idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          message: `${data[0].userName} have been log out.`,
        });
      });
    }
  });
};

const verifyToken = (req, res, next) => {
  const verificationToken = req.body.verificationToken;
  jwt.verify(
    verificationToken,
    process.env.VERIFICATION_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return res.status(403).json({
          error: err.message,
        });
      }
      const userData = {
        idUser: user.idUser,
        email: user.email,
        password: user.password,
        role: user.role,
        idRole: user.idRole,
        idEvent: user.idEvent,
      };
      User.getUserById(userData.idUser, async (err, data) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        if (data.length === 0) {
          return res.status(400).json({
            error: "Invalid token.",
          });
        } else {
          let validate = await bcrypt.compare(
            userData.password,
            data[0].userPassword
          );
          if (!validate) {
            return res.status(401).json({
              error: "Invalid user information.",
            });
          } else {
            const tokenContent = {
              idUser: userData.idUser,
              email: userData.email,
              name: data[0].userName,
              role: userData.role,
              idRole: userData.idRole,
              idEvent: user.idEvent,
            };
            const accessToken = generateAccessToken(tokenContent);
            const refreshToken = jwt.sign(
              tokenContent,
              process.env.REFRESH_TOKEN_SECRET
            );
            const tmpUserData = {
              token: refreshToken,
            };
            User.updateUserToken(tmpUserData, data[0].idUser, (err) => {
              if (err) {
                return res.status(401).json({
                  error: err.message,
                });
              }
              return res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                name: data[0].userName,
                role: userData.role,
                email: data[0].userEmail,
              });
            });
          }
        }
      });
    }
  );
};

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = {
  login,
  logout,
  authenticateToken,
  refreshToken,
  verifyToken,
};
