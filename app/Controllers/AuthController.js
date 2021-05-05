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
  User.getUserByEmail(loginData.userEmail, async (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(401).json({
        error: "Invalid email.",
      });
    } else {
      try {
        let userData = null;
        for (let i = 0; i < data.length; i++) {
          let validate = await bcrypt.compare(
            loginData.userPassword,
            data[i].userPassword
          );
          if (validate) {
            userData = data[i];
            break;
          }
        }
        if (userData) {
          Host.getHostByIdUser(userData.idUser, (err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            if (result.length === 0) {
              Committee.getCommitteeByIdUser(userData.idUser, (err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: err.message,
                  });
                }
                if (result.length === 0) {
                  Guest.getGuestByIdUser(userData.idUser, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: err.message,
                      });
                    }
                    const tokenContent = {
                      idUser: userData.idUser,
                      email: userData.email,
                      name: userData.userName,
                      role: 3,
                      idRole: result[0].idGuest,
                      idEvent: result[0].idEvent,
                    };
                    const accessToken = generateAccessToken(tokenContent);
                    const refreshToken = jwt.sign(
                      tokenContent,
                      process.env.REFRESH_TOKEN_SECRET
                    );
                    const tmpData = {
                      token: refreshToken,
                    };
                    const user = new User(tmpData);
                    user.updateUserToken(userData.idUser, (err) => {
                      if (err) {
                        return res.status(400).json({
                          error: err.message,
                        });
                      }
                      return res.status(200).json({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        name: userData.userName,
                        role: 2,
                      });
                    });
                  });
                } else {
                  const tokenContent = {
                    idUser: userData.idUser,
                    email: userData.email,
                    name: userData.userName,
                    role: 2,
                    idRole: result[0].idCommittee,
                  };
                  const accessToken = generateAccessToken(tokenContent);
                  const refreshToken = jwt.sign(
                    tokenContent,
                    process.env.REFRESH_TOKEN_SECRET
                  );
                  const tmpData = {
                    token: refreshToken,
                  };
                  const user = new User(tmpData);
                  user.updateUserToken(userData.idUser, (err) => {
                    if (err) {
                      return res.status(400).json({
                        error: err.message,
                      });
                    }
                    return res.status(200).json({
                      accessToken: accessToken,
                      refreshToken: refreshToken,
                      name: userData.userName,
                      role: 2,
                    });
                  });
                }
              });
            } else {
              const tokenContent = {
                idUser: userData.idUser,
                email: userData.email,
                name: userData.userName,
                role: 1,
                idRole: result[0].idHost,
              };
              const accessToken = generateAccessToken(tokenContent);
              const refreshToken = jwt.sign(
                tokenContent,
                process.env.REFRESH_TOKEN_SECRET
              );
              const tmpData = {
                token: refreshToken,
              };
              const user = new User(tmpData);
              user.updateUserToken(userData.idUser, (err) => {
                if (err) {
                  return res.status(400).json({
                    error: err.message,
                  });
                }
                return res.status(200).json({
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  name: userData.userName,
                  role: 1,
                });
              });
            }
          });
        } else {
          return res.status(401).json({
            error: "Invalid email or password.",
          });
        }
      } catch {
        return res.sendStatus(500);
      }
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
      const user = new User(userData);
      user.updateUserToken(data[0].idUser, (err) => {
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
        role: user.role,
        idRole: user.idRole,
        idEvent: user.idEvent,
      };
      User.getUserById(userData.idUser, (err, data) => {
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
          const tokenContent = {
            idUser: userData.idUser,
            email: userData.email,
            role: userData.role,
            idRole: userData.idRole,
            idEvent: userData.idEvent,
          };
          const accessToken = generateAccessToken(tokenContent);
          const refreshToken = jwt.sign(
            tokenContent,
            process.env.REFRESH_TOKEN_SECRET
          );
          const tmpUserData = {
            token: refreshToken,
          };
          const tmpUser = new User(tmpUserData);
          tmpUser.updateUserToken(data[0].idUser, (err) => {
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
