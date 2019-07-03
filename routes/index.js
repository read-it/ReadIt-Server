var express = require('express');
var router = express.Router();


router.use('/category', require('./category/index'));
router.use('/mypage', require('./mypage/index'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
