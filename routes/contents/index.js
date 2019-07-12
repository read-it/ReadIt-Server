const express = require('express')
const router = express.Router()

router.use('/',require('./read'))
router.use('/add',require('./add'))
router.use('/change',require('./change'))
router.use('/delete',require('./delete'))
router.use('/scrap',require('./scrap'))
router.use('/fix',require('./fix'))
router.use('/search', require('./search'))
router.use('/highlight',require('./highlight_add'))

module.exports = router