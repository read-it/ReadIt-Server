var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');
const jwt = require('../../module/jwt');
//const upload = require('../../config/multer')

router.post('/', async (req, res)=>{
    
    const sameEmailQuery = `SELECT email FROM user WHERE email = '${req.body.email}'`
    const sameEmailResult = await db.queryParam_None(sameEmailQuery);
    
    if(!sameEmailResult){
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else{
        if(sameEmailResult[0]){
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_USER));
        }else{
            if(req.body.password != req.body.rePassword){
                res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NOT_SAME_PASSWORD));
            } else {
                const insertUserQuery = 'INSERT INTO user (email,password,refresh_token,salt) VALUES (?, ?, ?, ?)';
                const salt = (await crypto.randomBytes(32)).toString('base64');
                const hashedPw = (await crypto.pbkdf2(req.body.password, salt, 1000, 32, 'SHA512')).toString('base64');
                const tokens = jwt.sign(req.body); // jwt.js로 인해 req.body를 바로 사용할 수 있는것.
                const insertUserResult = await db.queryParam_Arr(insertUserQuery,[req.body.email, hashedPw, tokens.refreshToken, salt]);

                console.log(insertUserResult);

                if(!insertUserResult){
                    res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.CREATED_USER_FAIL));
                } else{
                    res.setHeader("token",tokens.token);
                    res.status(200).send(utils.successTrue(statusCode.OK, resMessage.CREATED_USER));
                }
            }   
        }
    }
});

module.exports = router;
