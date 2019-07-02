const express = require('express')
const router = express.Router()

router.use('/main',require('./main'));
router.use('/contents',require('./storage_contents'))
//router.use('/',require('./categoty_detail'))

module.exports = router;