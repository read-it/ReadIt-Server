var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const pool = require('../../config/dbConfig');

const util = require('../../module/utils/utils');
const authUtil = require('../../module/utils/authUtils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const crypto = require('crypto-promise');
const jwtUtils = require('../../module/jwt');

router.post('/', async (req, res) => {
    let selectUserQuery = 'SELECT * FROM user WHERE email = ?'
    let userResult = await db.queryParam_Arr(selectUserQuery, [req.body.email]);
    
    if(!userResult) {
        console.log('userResult 없음');
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.LOGIN_FAIL));
        
    } else {
        const userSalt = userResult[0].salt;
        const inputHashedPw = await crypto.pbkdf2(req.body.password.toString('base64'), userSalt, 1000, 32, 'SHA512');
        if(userResult[0].password==inputHashedPw.toString('base64')){
            const tokens = jwtUtils.sign(req.body); // jwt.js로 인해 req.body를 바로 사용할 수 있는것.
            let updateTokenQuery = 'UPDATE user SET refresh_token = ? WHERE email = ?'
            let tokenUpdate = await db.queryParam_Parse(updateTokenQuery, [tokens.refreshToken,req.body.email]);
         //클라이언트에게 refreshToken을 안전한 저장소에 저장해달라고 설명
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS));//이 다음에 ,token 해줘야할듯...
            
        }
        else{
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.LOGIN_FAIL));
        }
    }
});

//토큰 재발급 (돌아는 가는데 잘되는건지 모르겠음...)
router.get('/refresh', async (req, res) => {
    //헤더로 보낼경우 대소문자 구분이 안됩니다. 직접 확인해보시면 더 조아요~ <소문자로 됨>

    const refreshToken = req.headers.refreshtoken;
    if(!refreshToken){
        res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.NULL_VALUE));
    }    
    else{
        let selectTokenUserQuery = 'SELECT * FROM user WHERE refresh_token = ?'
        let selectUser = await db.queryParam_Arr(selectUserQuery, refreshToken);
        const newAccessToken = jwt.refresh(selectUser[0]);
        res.status(statusCode.OK).send(utils.successTrue(statusCode.OK, resMessage.REFRESH_TOKEN, newAccessToken));
        }
    
    }
);

//미들웨어 사용
router.get('/', authUtil.isLoggedin, (req, res) => {
    console.log(req.decoded);
});

module.exports = router;
