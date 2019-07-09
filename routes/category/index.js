var express = require('express');
var router = express.Router();

router.use('/', require('./category.js'));
router.use('/unclassified', require('./unclassified.js'));
router.use('/modify', require('./modify.js'));
router.use('/delete', require('./delete.js'));
router.use('/order',require('./order.js'))

module.exports = router;