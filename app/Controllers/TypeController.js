const Type = require("../Models/Type");

const getAllType = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  Type.getAllType((err, result) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      result,
    });
  });
};

module.exports = {
  getAllType,
};
