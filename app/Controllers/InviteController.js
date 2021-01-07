const Invite = require("../Models/Invite");

const getInvite = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idEvent = req.body.idEvent;
  Invite.getInviteByIdEvent(idEvent, (err, result) => {
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

const createInvite = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const inviteData = {
    inviteTitle: req.body.inviteTitle,
    inviteSubTitle: req.body.inviteSubTitle,
    inviteDescription: req.body.inviteDescription,
    inviteHighlight: req.body.inviteHighlight,
    invitePrimary: req.body.invitePrimary,
    inviteSecondary: req.body.inviteSecondary,
    inviteAccent: req.body.inviteAccent,
    idEvent: req.body.idEvent,
  };
  const invite = new Invite(inviteData);
  invite.addInvite((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Invite.getInviteById(result.insertId, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(201).json({
        data: {
          idInvite: data[0].idInvite,
          inviteTitle: data[0].inviteTitle,
          inviteSubTitle: data[0].inviteSubTitle,
          inviteDescription: data[0].inviteDescription,
          inviteHighlight: data[0].inviteHighlight,
          invitePrimary: data[0].invitePrimary,
          inviteSecondary: data[0].inviteSecondary,
          inviteAccent: data[0].inviteAccent,
          idEvent: data[0].idEvent,
        },
      });
    });
  });
};

const updateInvite = (req, res, next) => {
  if (req.user.role != 1) {
    return res.sendStatus(401);
  }
  const idInvite = req.body.idInvite;
  const inviteData = {
    inviteTitle: req.body.inviteTitle,
    inviteSubTitle: req.body.inviteSubTitle,
    inviteDescription: req.body.inviteDescription,
    inviteHighlight: req.body.inviteHighlight,
    invitePrimary: req.body.invitePrimary,
    inviteSecondary: req.body.inviteSecondary,
    inviteAccent: req.body.inviteAccent,
  };
  const invite = new Invite(inviteData);
  invite.updateInvite(idInvite, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    Invite.getInviteById(idInvite, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        data: {
          idInvite: data[0].idInvite,
          inviteTitle: data[0].inviteTitle,
          inviteSubTitle: data[0].inviteSubTitle,
          inviteDescription: data[0].inviteDescription,
          inviteHighlight: data[0].inviteHighlight,
          invitePrimary: data[0].invitePrimary,
          inviteSecondary: data[0].inviteSecondary,
          inviteAccent: data[0].inviteAccent,
        },
      });
    });
  });
};

module.exports = {
  getInvite,
  createInvite,
  updateInvite,
};
