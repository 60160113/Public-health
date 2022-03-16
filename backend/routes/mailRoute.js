const router = require('express').Router()
const { required } = require('../configs/auth')
const auth = require('../configs/auth')
const mailController = require('../controllers/mailController')

router.post('/confirmMail', auth.optional, (req, res, next) => {
  mailController.sendMessage(req)
    .then((response) => {
      res.send(response)
    }).catch((error) => {
      console.log(error)
    })
})

router.post('/send', auth.required, (req, res, next) => {
  mailController.sendMessage(req)
    .then(() => {
      res.send({ status: 200, statusText: 'successful' })
    }).catch((error) => {
      console.log(error)
    })
})

module.exports = router