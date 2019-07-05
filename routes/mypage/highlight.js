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
    const userIdx = jwt.verify(req.headers.token).idx;

    //로그인 유저가 하이라이팅한 콘텐츠 가져오기
    const getHighlightListQuery = `SELECT C.*, H.*
                                FROM contents C RIGHT JOIN highlight H
                                ON C.contents_idx = H.contents_idx
                                WHERE C.user_idx = ${userIdx} ORDER BY C.contents_idx DESC`;
    const getHighlightListResult = await db.queryParam_None(getHighlightListQuery);

    const highlightList = getHighlightListResult;

    console.log(highlightList.pop());

    if (!getHighlightListResult) { //콘텐츠 idx 조회 실패했을 때
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.GET_HIGHLIGHT_LIST_FAIL));
    } else { 
        // const highlightedContents = new Object();
        // const highlightInContents = new Array();
        // const highlight = new Array();
        // for(const i = 0; i < getHighlightListResult.length; i++){
        //     if(getHighlightListResult[i].contents_idx != getHighlightListResult[i-1].contents_idx){

        //     }
        //     highlightedContents.contentsIdx = getHighlightListResult[i].contents_idx;
        //     highlight.push(getHighlightListResult[i]);
        //     highlightedContents.highlight = highlight;
        // }
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.GET_HIGHLIGHT_LIST_SUCCESS, getHighlightListResult))
    }
});

module.exports = router;