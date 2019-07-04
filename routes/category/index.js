var express = require('express');
var router = express.Router();

<<<<<<< HEAD
// router.use('/', require('./'));
=======
router.use('/', require('./category.js'));
router.use('/unclassified', require('./unclassified.js'));
router.use('/modify', require('./modify.js'));
>>>>>>> eb77d9f32b7f6f5314771a33ae3d76c11bc16756

module.exports = router;