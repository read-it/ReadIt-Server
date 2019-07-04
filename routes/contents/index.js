const express = require('express')
const router = express.Router()

router.use('/',require('./contents_add'))

module.exports = router