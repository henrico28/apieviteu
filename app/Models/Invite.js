const db = require("../../database");

class Invite {
  constructor(data) {
    this.inviteTitle = data.inviteTitle;
    this.inviteSubTitle = data.inviteSubTitle;
    this.inviteDescription = data.inviteDescription;
    this.inviteHighlight = data.inviteHighlight;
    this.invitePrimary = data.invitePrimary;
    this.inviteSecondary = data.inviteSecondary;
    this.inviteAccent = data.inviteAccent;
    this.idEvent = data.idEvent;
  }

  addInvite(callback) {
    db.query(
      `INSERT INTO eviteu_invite(inviteTitle, inviteSubTitle, inviteDescription, inviteHighlight, invitePrimary, inviteSecondary,  inviteAccent, idEvent) VALUES('${this.inviteTitle}', '${this.inviteSubTitle}', '${this.inviteDescription}', '${this.inviteHighlight}', '${this.invitePrimary}', '${this.inviteSecondary}', '${this.inviteAccent}', ${this.idEvent})`,
      callback
    );
  }

  updateInvite(idInvite, callback) {
    db.query(
      `UPDATE eviteu_invite SET inviteTitle = '${this.inviteTitle}', inviteSubTitle = '${this.inviteSubTitle}', inviteDescription = '${this.inviteDescription}', inviteHighlight = '${this.inviteHighlight}', invitePrimary = '${this.invitePrimary}', inviteSecondary = '${this.inviteSecondary}', inviteAccent = '${this.inviteAccent}' WHERE idInvite = ${idInvite}`,
      callback
    );
  }

  static getInviteById(idInvite, callback) {
    db.query(
      `SELECT * FROM eviteu_invite WHERE idInvite = ${idInvite}`,
      callback
    );
  }

  static getInviteByIdEvent(idEvent, callback) {
    db.query(
      `SELECT * FROM eviteu_invite WHERE idEvent = ${idEvent}`,
      callback
    );
  }

  static deleteInviteByIdEvent(idEvent, callback) {
    db.query(`DELETE FROM eviteu_invite WHERE idEvent = ${idEvent}`, callback);
  }
}

module.exports = Invite;
