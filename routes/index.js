var express = require('express');
var router = express.Router();


router.use('/category', require('./category/index'));
router.use('/mypage', require('./mypage/index'));
router.use('/user', require('./user/index'));
router.use('/contents', require('./contents/index'));
router.use('/storage', require('./storage/index'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;