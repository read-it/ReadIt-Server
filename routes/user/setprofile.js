var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

router.put('/',  upload.single('profile_img'), authUtils.isLoggedin, async (req, res) => {

    //토큰에서 유저 idx 가져오기
    const loginUserIdx = jwt.verify(req.headers.token).idx;

    let findUserIdxQuery = `SELECT profile_img, nickname FROM user WHERE user_idx=${req.decoded.idx}`;
    let userResult = await db.queryParam_None(findUserIdxQuery);

    if (!userResult){
        res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR)); 
    }
    else{
        let updateUserInfoQuery = 'UPDATE user SET profile_img = ?, nickname = ? WHERE user_idx = ?'
        let newNickname = req.body.nickname

        //닉네임 길이 유효성 검사
        if(newNickname.length<=5){
            let updateUserInfoResult = await db.queryParam_Arr(updateUserInfoQuery, [req.file.location , req.body.nickname, req.decoded.idx]);
            if(!updateUserInfoResult){
                res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR));
            } else{
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.CHANGE_SUCCESSS));
            }
        }
        else{
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_NICKNAME)); 
        }      
    }
});

module.exports = router;
