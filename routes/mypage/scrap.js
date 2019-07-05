var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const authUtil = require('../../module/utils/authUtils');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const jwt = require('../../module/jwt');

//스크랩한 목록 조회
router.get('/scraplist', authUtil.isLoggedin, async (req, res) => {
    //토큰을 통해 user 정보 가져오기
    const userIdx = req.decoded.idx;

    //로그인 유저가 스크랩한 콘텐츠 가져오기
    const getScrapListQuery = `SELECT * FROM scrap S LEFT JOIN
                                (SELECT C.*, COUNT(H.highlight_idx)AS highlight_cnt 
                                    FROM contents C LEFT JOIN highlight H
                                    ON C.contents_idx=H.contents_idx
                                    GROUP BY C.contents_idx) M
                                ON S.contents_idx = M.contents_idx
                                WHERE M.user_idx = ${userIdx} ORDER BY scrap_date DESC`;
    
    console.log(getScrapListQuery);
    
    const getScrapListResult = await db.queryParam_None(getScrapListQuery);

    if (!getScrapListResult) { //콘텐츠 idx 조회 실패했을 때
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.GET_SCRAP_LIST_FAIL));
    } else { 
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.GET_SCRAP_LIST_SUCCESS, getScrapListResult))
    }
});

module.exports = router;