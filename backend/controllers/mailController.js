const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'witcha@osdev.co.th',
    pass: 'jotijvxbltmybwvf'
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