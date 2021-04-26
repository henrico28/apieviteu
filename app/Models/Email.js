class Email {
  constructor(data) {
    this.detail = data.detail;
    this.credentials = data.credentials;
  }

  generateCommitteeEmail() {
    return `
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style type="text/css">
            .email-wrapper {
              font-family: Arial, Helvetica, sans-serif;
              overflow: hidden
            }
            .email-content {
              width: 600px;
              text-align: center;
            }
            .email-heading {
              color: white;
              background-color: #6610f2;
              padding: 10px;
              font-size: 2.5rem;
            }
            .email-body {
              padding: 20px;
              border: 2px solid #f3f3f4;
            }
            .email-button {
              color: white;
              background-color: #6610f2;
              border: #6610f2;
              font-size: 1rem;
              padding: 7px 15px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0">
          <table role="presentation" align="center" class="email-wrapper">
              <tr>
                <td>
                  <section class="email-content">
                    <div class="email-heading">
                      <h1>EViteU</h1>
                    </div>
                    <div class="email-body">
                      <div>
                        <label>Hi, <span style="font-weight: bold">${this.detail.userName}</span></label>
                      </div>
                      <div style="width: auto">
                        <p style="word-wrap: break-word">
                          You'r committee account has been activated. Log in now.
                        </p>
                      </div>
                      <div>
                        <a href="http://localhost:3000/login/${this.credentials.token}">
                          <button class="email-button">Log In</button>
                        </a>
                      </div>
                      <div>
                        <h4 style="margin-bottom: 5px">Login Information</h4>
                        <div>
                          <label style="display: block; margin: 5px 0"
                            >Email: ${this.credentials.email}</label
                          >
                          <label style="display: block; margin: 5px 0"
                            >Password: ${this.credentials.password}</label
                          >
                        </div>
                        <div>
                          <h4 style="margin-bottom: 5px">Contacts</h4>
                          <div>
                            <label style="display: block; margin: 5px 0"
                              >Email: ${this.detail.hostEmail}</label
                            >
                            <label style="display: block; margin: 5px 0"
                              >Phone: ${this.detail.hostPhoneNumber}</label
                            >
                          </div>
                      </div>
                    </div>
                  </section>
                </td>
              </tr>
          </table>
        </body>
      </html>
    `;
  }
}

module.exports = Email;
