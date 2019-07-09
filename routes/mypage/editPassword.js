var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const db = require('../../module/pool');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtils = require("../../module/utils/authUtils");
const jwt = require('../../module/jwt')

//비밀번호 변경
router.put('/', authUtils.isLoggedin, async (req, res) => {

    const userIdx = req.decoded.idx

    const getUserPasswordQuery = `SELECT password, salt FROM user WHERE user_idx = ${userIdx}`;
    const getUserPasswordResult = await db.queryParam_None(getUserPasswordQuery);

    if(!getUserPasswordResult){
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        const userPassword = getUserPasswordResult[0];

        //body로 받아온 비밀번호를 db에 저장된 salt로 해싱후 저장된 비밀번호와 비교
        const hashedPw = await crypto.pbkdf2(req.body.originalPassword.toString(), userPassword.salt.toString('base64'), 1000, 32, 'SHA512');
        if(hashedPw.toString('base64') != userPassword.password){
            //해싱된 비밀번호가 저장된 비밀번호와 다를 경우
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PASSWORD));
        } else {
            //입력 비밀번호, 재입력 비밀번호  같은지 확인
            if(req.body.newPassword != req.body.reNewPassword){
                res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NOT_SAME_PASSWORD));
            } else {
                //비밀번호 변경
                const salt = await crypto.randomBytes(32);
                const hashedPw = await crypto.pbkdf2(req.body.newPassword.toString(), salt.toString('base64'), 1000, 32, 'SHA512');
                //토큰 생성
                const tokens = jwt.sign(userIdx); 
                const editPasswordQuery = `UPDATE user SET password = ?, salt = ?, refresh_token = ? WHERE user_idx = ?`;
                const editPasswordResult = await db.queryParam_Arr(editPasswordQuery,[hashedPw.toString('base64'), salt.toString('base64'), tokens.refreshToken, userIdx]);
                
                if(!editPasswordResult){
                    res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.EDIT_PASSWORD_FAIL));
                } else{
                    res.status(200).send(utils.successTrue(statusCode.OK, resMessage.EDIT_PASSWORD_SUCCESS, {accesstoken : tokens.token, refreshtoken : tokens.refreshToken}));
                }
            }

        }
    }
});

module.exports = router;