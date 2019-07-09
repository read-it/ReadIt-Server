var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');
const jwt = require('../../module/jwt');
//const upload = require('../../config/multer')
var isAlphanumeric = require('is-alphanumeric');
var validator = require("email-validator");

router.post('/', async (req, res)=>{
    //비밀번호 형식 확인하는 function
    function passwordIsValid(password) {
        if(password.length<=12 && password.length>=8){
            return(isAlphanumeric(password));
        }
        else{
            return false
        }
    }
    //이메일 형식이 아닌 경우 실패
    if(!(validator.validate(req.body.email))){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_EMAIL));
    }
    else{

    //같은 이메일 찾아서 가져오기
    const sameEmailQuery = `SELECT email FROM user WHERE email = '${req.body.email}'`
    const sameEmailResult = await db.queryParam_None(sameEmailQuery);
    
    
    if(!sameEmailResult){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else{
        //동일이메일 있을 시 회원가입 실패
        if(sameEmailResult[0]){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_USER));
        }else{

            //패스워드 형식이 아닌 경우 실패
            if(!(passwordIsValid(req.body.password))){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_PASSWORD));
            }
            else{
            //재입력 비밀번호가 같지 않을 시 실패
            if(req.body.password != req.body.repassword){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NOT_SAME_PASSWORD));
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

                    console.log(insertUserResult)
            
                    const loginUserIdx = insertUserResult.insertId

                    //전체 카테고리 생성
                    const insertCategoryQuery = 'INSERT INTO category (category_name, user_idx) VALUES (?, ?)';
                    const insertTotalCategoryResult = await connection.query(insertCategoryQuery, ['전체', loginUserIdx]);

                    //토큰 생성
                    const tokens = jwt.sign(loginUserIdx); 
                    const updateRefreshTokenResult = await connection.query(updateRefreshTokenQuery, [tokens.refreshToken, loginUserIdx]);
                    if(!updateRefreshTokenResult){
                        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                    }else{
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.CREATED_USER, {accesstoken : tokens.token, refreshtoken : tokens.refreshToken} ));
                    }
                });
        }}
    }
}}});

module.exports = router;
