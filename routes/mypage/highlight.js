var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const authUtil = require('../../module/utils/authUtils');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const jwt = require('../../module/jwt');


router.get('/highlightlist',authUtil.isLoggedin, async (req, res) => {
    //토큰을 통해 user 정보 가져오기

    const userIdx = req.decoded.idx;

    //로그인 유저가 하이라이팅한 콘텐츠, 하이라이트개수를 최근 하이라이트 시간순으로 가져오기
    const getHighlightListQuery = `
    SELECT * FROM
        (SELECT C.*, COUNT(H.highlight_idx)AS highlight_cnt, MAX(H.highlight_date) AS recent_date
        FROM contents C LEFT JOIN highlight H
        ON C.contents_idx = H.contents_idx
        WHERE C.delete_flag = false
        GROUP BY C.contents_idx ) S
    WHERE S.user_idx = ${userIdx} AND S.highlight_cnt > 0  ORDER BY S.recent_date DESC`;

    //특정콘텐츠의 하이라이트 가져오기
    const getHighlightInContentsQuery = `SELECT * FROM highlight
                                            WHERE contents_idx = ?
                                            ORDER BY highlight_date DESC`;

    //클라이언트에게 보내줄 형식
        // data:[{ 
        //  "contentsInfo" : {콘텐츠 정보},
        //  "highlightList" : [{하이라이트1},{하이라이트2}, ...]
        // },
        // { 
        //  "contentsInfo" : {콘텐츠 정보},
        //  "highlightList" : [{하이라이트1},{하이라이트2}, ...]
        // }]
    const highlightList = new Array();

    const getHighlightListTransaction = await db.Transaction(async(connection) => {
        var getHighlightListResult = await connection.query(getHighlightListQuery);

        for(var i = 0; i < getHighlightListResult.length; i++){
            
            getHighlightInContentsResult = await connection.query(getHighlightInContentsQuery, [getHighlightListResult[i].contents_idx]);
            
            //json형식으로 저장
            const highlightedContents = new Object();
            highlightedContents.contentsInfo = getHighlightListResult[i];
            highlightedContents.highlightList = getHighlightInContentsResult;
        
            //배열에 넣기
            highlightList.push(highlightedContents);
        }
    })

    if (!getHighlightListTransaction) { //콘텐츠 idx 조회 실패했을 때
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.GET_HIGHLIGHT_LIST_FAIL));
    } else { 
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.GET_HIGHLIGHT_LIST_SUCCESS, highlightList))
    }
});

module.exports = router;