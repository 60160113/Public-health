const router = require('express').Router()
const { required } = require('../configs/auth')
const auth = require('../configs/auth')
const datalistController = require('../controllers/datalistController')

router.post('/getOne', auth.required, datalistController.getOne)

router.post('/getAll', auth.required, datalistController.getAll)

router.post('/get', auth.required, datalistController.get)

module.exports = router