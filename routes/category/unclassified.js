var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.get('/', async (req, res) => {
    //하이라이팅 개수 아직
    let unCateQuery = `SELECT cont.contents_idx, cont.title, cont.thumbnail, cont.contents_url, cont.estimate_time, cate.category_idx, u.user_idx, cate.category_name
    FROM contents AS cont
    INNER JOIN category AS cate
    ON cate.category_name LIKE '전체' AND cate.category_idx = cont.category_idx
    INNER JOIN user AS u
    ON u.user_idx = ?
    WHERE cate.user_idx = u.user_idx
    ORDER BY cont.contents_idx DESC` ;
    let QueryResult = await db.queryParam_None(unCateQuery);
    if(!unCateQuery) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.UNCLASSIFIED_CATE_SELECT_SUCCESS,  {content_list : QueryResult}));
    }
});

module.exports = router;