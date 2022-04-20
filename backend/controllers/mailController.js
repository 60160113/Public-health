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
    const mailOptions = req.body;
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.send(err);
      } else {
        res.send(info);
      }
    });
  }
};
