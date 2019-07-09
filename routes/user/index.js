var express = require('express');
var router = express.Router();

router.use('/signin', require('./signin'));
router.use('/signup', require('./signup'));
router.use('/signout', require('./signout'));
router.use('/setprofile', require('./setprofile'));

module.exports = router;