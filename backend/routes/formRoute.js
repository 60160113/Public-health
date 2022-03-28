const router = require('express').Router()
const { required } = require('../configs/auth')
const auth = require('../configs/auth')
const formController = require('../controllers/formController')

router.post('/submit', auth.required, formController.submit)

router.post('/submit/multiple', auth.required, formController.multipleSubmit)

router.post('/delete', auth.required, formController.delete)

router.post('/delete/multiple', auth.required, formController.multipleDelete)

module.exports = router