const express = require('express')
const router = express.Router()

router.use('/main',require('./main'));
router.use('/edit',require('./edit'))
router.use('/',require('./categoty_detail'))

module.exports = router;