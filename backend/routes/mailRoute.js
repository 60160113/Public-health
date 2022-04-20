const router = require('express').Router()
const { required } = require('../configs/auth')
const auth = require('../configs/auth')
const mailController = require('../controllers/mailController')

router.post('/send', auth.required, mailController.send)

module.exports = router