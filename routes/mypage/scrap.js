var express = require('express');
var router = express.Router();

const db = require('../../modules/pool');

const authUtil = require('../../modules/utils/authUtils');
const util = require('../../modules/utils/utils');
const statusCode = require('../../modules/utils/statusCode');
const resMessage = require('../../modules/utils/responseMessage');
const jwt = require('jsonwebtoken');

//스크랩한 목록 조회
router.get('/scraplist', /*authUtil.isLoggedin,*/ async (req, res) => {
    //토큰을 통해 user 정보 가져오기
    //const userInfo = jwt.verify(req.headers.token);  쿼리에 userInfo.idx 넣기

    //로그인 유저가 스크랩한 콘텐츠 가져오기
    const getScrapListQuery = `SELECT * FROM scrap S LEFT JOIN
                                (SELECT C.*, COUNT(H.highlight_idx)AS highlight_cnt 
                                    FROM contents C LEFT JOIN highlight H
                                    ON C.contents_idx=H.contents_idx
                                    GROUP BY C.contents_idx) M
                                ON S.contents_idx = M.contents_idx
                                WHERE S.user_idx = ${req.body.temp_idx} ORDER BY scrap_date DESC`;
    
    console.log(getScrapListQuery);
    
    const getScrapListResult = await db.queryParam_None(getScrapListQuery);

    if (!getScrapListResult) { //콘텐츠 idx 조회 실패했을 때
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GET_SCRAP_LIST_FAIL));
    } else { 
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.GET_SCRAP_LIST_SUCCESS, getScrapListResult))
    }
});

module.exports = router;