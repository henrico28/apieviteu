const bcrypt = require("bcrypt");
const Committee = require("../Models/Committee");

const getAllCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  Committee.getAllCommitteeByIdEvent(idEvent, (err, result) => {
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

const createCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.committeePassword, salt);
    const committeeData = {
      committeeName: req.body.committeeName,
      committeeEmail: req.body.committeeEmail,
      committeePassword: hashedPassword,
      idEvent: req.body.idEvent,
    };
    const committee = new Committee(committeeData);
    Committee.getCommitteeByIdEventEmail(
      committeeData.idEvent,
      committeeData.committeeEmail,
      (err, data) => {
        if (err) {
          return res.status(400).json({
            error: err.message,
          });
        }

        if (data.length >= 1) {
          if (data[0].committeeEmail === committeeData.committeeEmail) {
            return res.status(409).json({
              message: "Email already exists",
            });
          }
        } else {
          committee.addCommittee((err, result) => {
            if (err) {
              return res.status(400).json({
                error: err.message,
              });
            }

            Committee.getCommitteeById(result.insertId, (err, data) => {
              if (err) {
                return res.status(400).json({
                  error: err.message,
                });
              }
              return res.status(201).json({
                data: {
                  idCommittee: data[0].idCommittee,
                  committeeName: data[0].committeeName,
                  committeeEmail: data[0].committeeEmail,
                  idEvent: data[0].idEvent,
                },
              });
            });
          });
        }
      }
    );
  } catch {
    return res.sendStatus(500);
  }
};

const deleteCommittee = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idCommittee = req.body.idCommittee;
  Committee.getCommitteeById(idCommittee, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    if (data.length === 0) {
      return res.status(409).json({
        error: "Invalid Committee ID",
      });
    }
    Committee.deleteCommitteeById(idCommittee, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        message: `Committee ${data[0].committeName} Successfully Deleted`,
      });
    });
  });
};

const updateCommittee = async (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  try {
    const idCommittee = req.body.idCommittee;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.committeePassword, salt);
    const committeeData = {
      committeeName: req.body.committeeName,
      committeeEmail: req.body.committeeEmail,
      committeePassword: hashedPassword,
      idEvent: req.body.idEvent,
    };
    const committee = new Committee(committeeData);
    committee.updateCommittee(idCommittee, (err) => {
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
          data: {
            idCommittee: data[0].idCommittee,
            committeeName: data[0].committeeName,
            committeeEmail: data[0].committeeEmail,
            idEvent: data[0].idEvent,
          },
        });
      });
    });
  } catch {
    return res.status(500);
  }
};

module.exports = {
  getAllCommittee,
  createCommittee,
  deleteCommittee,
  updateCommittee,
};
