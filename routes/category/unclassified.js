var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const authUtil = require('../../module/utils/authUtils');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const moment = require('moment');

router.get('/', authUtil.isLoggedin ,async (req, res) => {
    let user = req.decoded.idx;

    let unCateQuery = `SELECT G.category_name, M.* FROM category G LEFT JOIN
    (SELECT C.category_idx, C.user_idx, C.contents_idx, C.title, C.thumbnail, C.contents_url, C.estimate_time, C.created_date, C.delete_flag, COUNT(H.highlight_idx) AS highlight_cnt FROM contents C LEFT JOIN highlight H
    ON C.contents_idx = H.contents_idx
    WHERE C.delete_flag = 0
    GROUP BY C.contents_idx) M
    ON G.category_idx = M.category_idx
    WHERE G.category_name LIKE '전체' AND M.user_idx = ${user} AND M.delete_flag = 0
    ORDER BY M.created_date DESC` ;

    let QueryResult = await db.queryParam_Arr(unCateQuery, [info.created_time, user]);
    if(!unCateQuery) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.UNCLASSIFIED_CATE_SELECT_SUCCESS,  {content_list : QueryResult}));
    }
});

module.exports = router;