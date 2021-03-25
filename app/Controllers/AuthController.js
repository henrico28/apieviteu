const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Host = require("../Models/Host");
const Guest = require("../Models/Guest");
const Committee = require("../Models/Committee");

const login = async (req, res, next) => {
  const hostData = {
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
  };
  Host.getHostByUserEmail(hostData.userEmail, async (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(401).json({
        error: "No account with that email found.",
      });
    }
    try {
      let validate = await bcrypt.compare(
        hostData.userPassword,
        data[0].userPassword
      );
      if (validate) {
        let tokenContent = {
          idUser: data[0].idUser,
          email: hostData.userEmail,
          role: 1,
        };
        const accessToken = generateAccessToken(tokenContent);
        const refreshToken = jwt.sign(
          tokenContent,
          process.env.REFRESH_TOKEN_SECRET
        );
        const userData = {
          token: refreshToken,
        };
        const user = new User(userData);
        user.updateUserToken(data[0].idUser, (err) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          return res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            name: data[0].userName,
          });
        });
      } else {
        return res.status(401).json({
          error: "Invalid Email or Password.",
        });
      }
    } catch {
      return res.sendStatus(500);
    }
  });
};

const loginToEvent = (req, res, next) => {
  const idEvent = req.body.idEvent;
  const loginData = {
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
    idEvent: req.body.idEvent,
  };
  Guest.getGuestByIdEventEmail(
    idEvent,
    loginData.userEmail,
    async (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      if (data.length === 0) {
        Committee.getCommitteeByIdEventEmail(
          idEvent,
          loginData.userEmail,
          async (err, data) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            if (data.length === 0) {
              return res.status(401).json({
                error: "Invalid Email",
              });
            } else {
              try {
                let validate = await bcrypt.compare(
                  loginData.userPassword,
                  data[0].userPassword
                );
                if (validate) {
                  let tokenContent = {
                    idUser: data[0].idUser,
                    email: loginData.userEmail,
                    role: 2,
                    idEvent: idEvent,
                  };
                  const accessToken = generateAccessToken(tokenContent);
                  const refreshToken = jwt.sign(
                    tokenContent,
                    process.env.REFRESH_TOKEN_SECRET
                  );
                  const userData = {
                    token: refreshToken,
                  };
                  const user = new User(userData);
                  user.updateUserToken(data[0].idUser, (err) => {
                    if (err) {
                      return res.status(400).json({
                        error: err.message,
                      });
                    }
                    return res.status(200).json({
                      accessToken: accessToken,
                      refreshToken: refreshToken,
                    });
                  });
                } else {
                  return res.status(401).json({
                    error: "Invalid Email or Password",
                  });
                }
              } catch {
                return res.sendStatus(500);
              }
            }
          }
        );
      } else {
        try {
          let validate = await bcrypt.compare(
            loginData.userPassword,
            data[0].userPassword
          );
          if (validate) {
            let tokenContent = {
              idUser: data[0].idUser,
              email: loginData.userEmail,
              role: 3,
              idEvent: idEvent,
            };
            const accessToken = generateAccessToken(tokenContent);
            const refreshToken = jwt.sign(
              tokenContent,
              process.env.REFRESH_TOKEN_SECRET
            );
            const userData = {
              token: refreshToken,
            };
            const user = new User(userData);
            user.updateUserToken(data[0].idUser, (err) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              return res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            });
          } else {
            return res.status(401).json({
              error: "Invalid Email or Password",
            });
          }
        } catch {
          return res.sendStatus(500);
        }
      }
    }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const refreshToken = (req, res, next) => {
  const email = req.body.userEmail;
  const refreshToken = req.body.refreshToken;
  if (email == null || refreshToken == null) return res.sendStatus(401);
  User.getUserByEmail(email, (err, result) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(401).json({
        error: "Invalid Email",
      });
    } else {
      if (result[0].token !== refreshToken) {
        return res.status(401).json({
          error: "Invalid Refresh Token",
        });
      }
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
          const accessToken = generateAccessToken(user);
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
  User.getUserByEmail(email, (err, data) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(409).json({
        error: "Invalid Email",
      });
    } else {
      if (data[0].token !== refreshToken) {
        return res.status(401).json({
          error: "Invalid Token",
        });
      }
      const userData = {
        token: null,
      };
      const user = new User(userData);
      user.updateUserToken(data[0].idUser, (err) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          message: `${data[0].userName} have been log out`,
        });
      });
    }
  });
};

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
};

module.exports = {
  login,
  logout,
  loginToEvent,
  authenticateToken,
  refreshToken,
};
