const db = require("../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Token = require("../Models/Token");

const login = async (req, res, next) => {
  const userData = {
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
  };
  User.getUserByEmail(userData.userEmail, async (err, data) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(400).json({
        error: "Invalid Email",
      });
    }
    try {
      let validate = await bcrypt.compare(
        userData.userPassword,
        data[0].userPassword
      );
      if (validate) {
        let tokenContent = {
          email: userData.userEmail,
        };
        const accessToken = generateAccessToken(tokenContent);
        const refreshToken = jwt.sign(
          tokenContent,
          process.env.REFRESH_TOKEN_SECRET
        );
        const token = new Token(refreshToken);
        token.addToken((err) => {
          if (err) {
            return res.status(500).json({
              error: err.message,
            });
          }

          return res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        });
      } else {
        return res.status(400).json({
          error: "Invalid Email or Password",
        });
      }
    } catch {
      return res.status(500);
    }
  });
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
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  Token.getTokenByToken(refreshToken, (err, result) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(401).json({
        error: "Invalid Refresh Token",
      });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: err.message,
        });
      }
      const accessToken = generateAccessToken(user);
      return res.status(200).json({
        accessToken: accessToken,
      });
    });
  });
};

const logout = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  Token.getTokenByToken(refreshToken, (err, data) => {
    if (err) {
      return res.status(401).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(409).json({
        error: "Invalid Refresh Token",
      });
    }
    Token.deleteTokenById(data[0].idToken, (err) => {
      if (err) {
        return res.status(409).json({
          error: err.message,
        });
      }
      return res.sendStatus(204);
    });
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
  authenticateToken,
  refreshToken,
};
