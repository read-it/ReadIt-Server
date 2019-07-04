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
    
    //같은 이메일 찾아서 가져오기
    const sameEmailQuery = `SELECT email FROM user WHERE email = '${req.body.email}'`
    const sameEmailResult = await db.queryParam_None(sameEmailQuery);
    
    
    if(!sameEmailResult){
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else{
        //동일이메일 있을 시 회원가입 실패
        if(sameEmailResult[0]){
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_USER));
        }else{
            //재입력 이메일이 같지 않을 시 실패
            if(req.body.password != req.body.rePassword){
                res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NOT_SAME_PASSWORD));
            } else {
                //유저 등록 쿼리
                const insertUserQuery = 'INSERT INTO user (email,password,salt) VALUES (?, ?, ?)';
                //등록된 유저 리프레시 등록 쿼리
                const updateRefreshTokenQuery = `UPDATE user SET refresh_token = ? WHERE user_idx = ?`;

                const signupTransaction = await db.Transaction(async(connection) => {
                    //비밀번호 생성
                    const salt = (await crypto.randomBytes(32)).toString('base64');
                    const hashedPw = (await crypto.pbkdf2(req.body.password, salt, 1000, 32, 'SHA512')).toString('base64');
                    
                    //유저 등록 실행
                    const insertUserResult = await connection.query(insertUserQuery,[req.body.email, hashedPw, salt]);

                    //토큰 생성
                    const tokens = jwt.sign(insertUserResult); 
                    const updateRefreshTokenResult = await connection.query(updateRefreshTokenQuery, [tokens.refreshToken,tokens.idx]);
                    if(!updateRefreshTokenResult){
                        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                    } else{
                        //헤더에 토큰 담기
                        res.setHeader("token",tokens.token);
                    }
                });

                if(!signupTransaction){
                    res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.CREATED_USER_FAIL));
                } else{
                    res.status(200).send(utils.successTrue(statusCode.OK, resMessage.CREATED_USER));
                }
            }   
        }
    }
});

module.exports = router;
