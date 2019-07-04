var express = require('express')
var router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
// // 실패
// res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
// //성공
// res.status(200).send(util.successTrue(statusCode.OK, resMessage.EPISODE_SELECT_SUCCESS, data));
router.get('/',async (req, res) => {
    res.status(200).send(util.successTrue(statusCode.OK,resMessage.OK))
})

module.exports = router;