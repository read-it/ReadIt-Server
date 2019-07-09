var express = require('express');
var router = express.Router();

router.use('/scrap', require('./scrap'));
router.use('/highlight', require('./highlight'));
router.use('/trashcan', require('./trashcan'));
router.use('/editPassword', require('./editPassword'));
// router.use('/setReaditTime', require('./setReaditTime'));
// router.use('/pushAlarm', require('./pushAlarm'));

module.exports = router;