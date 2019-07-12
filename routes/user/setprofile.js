var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtil = require('../../module/utils/authUtils');
const upload = require('../../config/multer');

router.put('/',  upload.single('profile_img'), authUtil.isLoggedin, async (req, res) => {

    let findUserIdxQuery = `SELECT profile_img, nickname FROM user WHERE user_idx=${req.decoded.idx}`;
    let userResult = await db.queryParam_None(findUserIdxQuery);

    if (!userResult){
        res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR)); 
    }
    else{
        let updateUserInfoQuery = 'UPDATE user SET profile_img = ?, nickname = ? WHERE user_idx = ?';
        let newNickname = req.body.nickname;
        
        //닉네임 null 일 경우
        if(!newNickname){
            newNickname = userResult[0].nickname;
        }

        let profileImg = new String();
        
        //사진 null 일 경우
        if(!req.file){
            profileImg = userResult[0].profile_img;
        } else {
            profileImg = req.file.location;
        }

        //닉네임 길이 유효성 검사
        if(newNickname.length<=5){

            let updateUserInfoResult = await db.queryParam_Arr(updateUserInfoQuery, [profileImg , newNickname, req.decoded.idx]);

            if(!updateUserInfoResult){
                res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR));
            } else{
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.CHANGE_SUCCESS));
            }
        }
        else{
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_NICKNAME)); 
        }      
    }
});

module.exports = router;
