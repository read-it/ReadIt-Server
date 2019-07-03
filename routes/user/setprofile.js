var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const upload = require('../../config/multer'); // image-upload

//router.put('/', async (req, res) => {  //S3 적용 안해서 사진파일 말고 텍스트로.
router.put('/', upload.single('img'), async (req, res) => {

    //accessToken으로 select user 하는 방법 찾기(우선 idx로 찾기.)
    let findUserIdxQuery = "SELECT profile_img, nickname FROM user WHERE user_idx=?";
    let userResult = await db.queryParam_Arr(findUserIdxQuery, [req.body.user_idx]);
    if(!req.body.user_idx){
        res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.NULL_VALUE)); 
    }
    else if (!userResult){
        res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR)); 
    }
    else{
        let updateImgQuery = 'UPDATE user SET profile_img = ? WHERE user_idx = ?'
        //let imgUpdate = await db.queryParam_Arr(updateImgQuery, [req.body.profile_img,req.body.user_idx]);
        let imgUpdate = await db.queryParam_Arr(updateImgQuery, [req.file.location , req.body.user_idx]);
        console.log(imgUpdate);
        let updateNicknameQuery = 'UPDATE user SET nickname = ? WHERE user_idx = ?'
        let newNickname = req.body.nickname
        if(newNickname.length<=5){
            let nicknameUpdate = await db.queryParam_Arr(updateNicknameQuery, [req.body.nickname , req.body.user_idx]);
            console.log(nicknameUpdate);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.CHANGE_SUCCESSS), );
        }
        else{
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_NICKNAME)); 
        }      
    }
});



module.exports = router;
