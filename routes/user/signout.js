var express = require('express');
var router = express.Router();
const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtil = require('../../module/utils/authUtils')

router.put('/', authUtil.isLoggedin, async (req, res) => {

    const userIdx = req.decoded.idx;

    //회원 리프레시토큰 지우기
    let deleteRefreshTokenQuery = `UPDATE user SET refresh_token = null WHERE user_idx = ${userIdx}`
    let deleteRefreshTokenResult = await db.queryParam_None(deleteRefreshTokenQuery);

    if(!deleteRefreshTokenResult) {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }
    else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGOUT_SUCCESS));
    }
});

module.exports = router;
