const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('./modules/restaurant')

router.use('/', home)
router.use('/', restaurants)

module.exports = router
