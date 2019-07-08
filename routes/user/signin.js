var express = require('express');
var router = express.Router();
const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const crypto = require('crypto-promise');
const jwt = require('../../module/jwt');

router.post('/', async (req, res) => {
    //회원 이메일로 해당 유저 정보 가져오기
    let selectUserQuery = 'SELECT * FROM user WHERE email = ?'
    let userResult = await db.queryParam_Arr(selectUserQuery, [req.body.email]);
    if(!(userResult[0])) {
        //회원이 아닐시
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.LOGIN_FAIL));
        
    }
    else {
        const userSalt = userResult[0].salt;
        const inputHashedPw = await crypto.pbkdf2(req.body.password.toString('base64'), userSalt, 1000, 32, 'SHA512');

        //입력비밀번호와 저장 비밀번호 같은지 체크
        if(userResult[0].password==inputHashedPw.toString('base64')){
            //토큰 발급
            const tokens = jwt.sign(userResult[0].user_idx);
            let updateTokenQuery = 'UPDATE user SET refresh_token = ? WHERE email = ?'
            let updateTokenResult = await db.queryParam_Parse(updateTokenQuery, [tokens.refreshToken,req.body.email]);
            if(!updateTokenResult){
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }else{
            //클라이언트에게 refreshToken을 안전한 저장소에 저장해달라고 설명
                // res.setHeader("accesstoken",tokens.token); (헤더에 넣어줄 경우)
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, {accesstoken : tokens.token, refreshtoken : tokens.refreshToken} ));
            }
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
        let selectUser = await db.queryParam_Arr(selectTokenUserQuery, refreshToken);
        if(!(selectUser)){
            res.status(200).send(util.successFalse(statusCode.UNAUTHORIZED, resMessage.NOT_SAME_REFRESH_TOKEN));
        }
        else{
        const newAccessToken = jwt.refresh(selectUser[0]);
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.REFRESH_TOKEN, {accesstoken : newAccessToken, refreshtoken : tokens.refreshToken} ));
            }
        }
    }
);

module.exports = router;
