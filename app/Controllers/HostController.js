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
    const user = new User(userData);
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
        user.addUser((err, result) => {
          if (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
          const hostData = {
            phoneNumber: req.body.phoneNumber,
            idUser: result.insertId,
          };
          const host = new Host(hostData);
          host.addHost((err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }
            Host.getHostByIdHost(result.insertId, (err, data) => {
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
                  idHost: data[0].idHost,
                  phoneNumber: data[0].phoneNumber,
                },
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
