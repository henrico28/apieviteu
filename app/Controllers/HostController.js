const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Host = require("../Models/Host");

const getAllHost = (req, res, next) => {
  Host.getAllHost((err, result) => {
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

const createHost = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.userPassword, salt);
    const userData = {
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPassword: hashedPassword,
    };
    Host.getHostByUserEmail(userData.userEmail, (err, data) => {
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
        User.addUser(userData, (err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          const hostData = {
            phoneNumber: req.body.phoneNumber,
            idUser: result.insertId,
          };
          Host.addHost(hostData, (err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            Host.getHostById(result.insertId, (err, data) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }

              return res.status(201).json({
                message: `Account ${data[0].userName} has been successfully created.`,
              });
            });
          });
        });
      }
    });
  } catch {
    return res.sendStatus(500);
  }
};

module.exports = {
  getAllHost,
  createHost,
};
