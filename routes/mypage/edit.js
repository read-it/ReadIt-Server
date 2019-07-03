var express = require('express');
var router = express.Router();

const db = require('../../modules/pool');

const util = require('../../modules/utils/utils');
const statusCode = require('../../modules/utils/statusCode');
const resMessage = require('../../modules/utils/responseMessage');

//비밀번호 변경
router.put('/password', async (req, res) => {

    /////////////////////////
    /// 토큰 발급 되면 변경하기!! 백틱부분 변경
    //////////////////////
    const getUserPasswordQuery = `SELECT password, salt FROM user WHERE user_idx = ${req.body.idx}`;
    const getUserPasswordResult = await db.queryParam_None(getUserPasswordQuery);

    if(!getUserPasswordResult){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        const userPassword = getUserPasswordResult[0];

        //body로 받아온 비밀번호를 db에 저장된 salt로 해싱후 저장된 비밀번호와 비교
        const hashedPw = await crypto.pbkdf2(req.body.originalPassword.toString(), userPassword.salt.toString('base64'), 1000, 32, 'SHA512').toString();
        if(hashedPw != userPassword.password){
            //해싱된 비밀번호가 저장된 비밀번호와 다를 경우
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.WRONG_PASSWORD));
        }
    }

    if(req.body.newPassword != req.body.reNewPassword){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.DIFFERENT_PASSWORD));
    } else {
        const salt = await crypto.randomBytes(32);
        const hashedPw = await crypto.pbkdf2(req.body.reNewPassword.toString(), salt.toString('base64'), 1000, 32, 'SHA512');
        const editPasswordQuery = `UPDATE user SET password = ?, salt = ? WHERE user_idx = ?`;
        const editPasswordResult = await db.queryParam_Arr(editPasswordQuery,[hashedPw, salt, req.body.temp_idx]);
        
        if(!editPasswordResult){
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.EDIT_PASSWORD_FAIL));
        } else{
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.EDIT_PASSWORD_SUCCESS));
        }
    }
});

module.exports = router;