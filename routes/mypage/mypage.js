var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const authUtil = require('../../module/utils/authUtils');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.get('/',authUtil.isLoggedin, async (req, res) => {
    let selectUserQuery = 
    `
    SELECT email, nickname, profile_img 
    FROM user
    WHERE user_idx = ${req.decoded.idx}
    `
    let selectUserResult = await db.queryParam_None(selectUserQuery)

    if(selectUserResult != null){
        if(selectUserResult.length == 1){
            res.status(200).send(utils.successTrue(statusCode.OK,resMessage.GET_USER_SUCCESS,selectUserResult))
        } else {
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST,resMessage.BAD_REQUEST))
        }
    } else {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    }
})

module.exports = router