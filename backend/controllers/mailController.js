const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_MAIL_USER,
    pass: process.env.APP_MAIL_PASSWORD
  },
  tls: {
    ciphers: "SSLv3"
  }
});

module.exports = {
  send: async (req, res, next) => {
    const mailOptions = { ...req.body };
    if (!mailOptions.from) {
      mailOptions.from = process.env.APP_MAIL_USER;
    }
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(err.responseCode).send(err);
      } else {
        res.send(info);
      }
    });
  },
  sendMultiple: async (req, res, next) => {
    try {
      var response = [];

      var mailOptions = { ...req.body };
      if (!mailOptions.from) {
        mailOptions.from = process.env.APP_MAIL_USER;
      }
      for await (const elem of req.body.to) {
        mailOptions.to = elem;
        await transporter.sendMail(mailOptions, async function(err, info) {
          if (err) {
            throw err;
          } else {
            await response.push(info);
          }
        });
      }
      await res.send(response);
    } catch (error) {
      res.send(error);
    }
  }
};
