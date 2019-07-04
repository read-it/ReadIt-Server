const express = require('express');
const router = express.Router();
const authMiddleware = require('../modules/utils/authUtils')
// router.use('/user', require('./user/index'));
// router.use('/category', require('./category/index'));
router.use('/contents', require('./contents/index'));
// router.use('/mypage', require('./mypage/index'));
router.use('/storage', require('./storage/index'))

module.exports = router;