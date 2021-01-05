const db = require("../../database");

class Token {
  constructor(token) {
    this.token = token;
  }

  addToken(callback) {
    db.query(
      `INSERT INTO eviteu_token(token) VALUES('${this.token}')`,
      callback
    );
  }

  static getTokenByToken(token, callback) {
    db.query(`SELECT * FROM eviteu_token WHERE token = '${token}'`, callback);
  }

  static deleteTokenById(idToken, callback) {
    db.query(`DELETE FROM eviteu_token WHERE idToken = ${idToken}`, callback);
  }
}

module.exports = Token;
