const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'jrk-crm@jorakay.co.th',
    pass: 'Jorakay2021'
  },
  tls: {
    ciphers: 'SSLv3'
  }
})

module.exports = {
  sendMessage: async (req, res, next) => {
    const mailOptions = req.body
    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return err
      } else {
        return info
      }
    })
  }
}