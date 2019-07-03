var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

//삭제된 콘텐츠 조회
router.get('/', async (req, res) => {
    const getDeletedListQuery = `SELECT * FROM contents C LEFT JOIN
                                (SELECT C.*, COUNT(H.highlight_idx)AS highlight_cnt 
                                    FROM contents C LEFT JOIN highlight H
                                    ON C.contents_idx=H.contents_idx
                                    GROUP BY C.contents_idx) M
                                ON C.contents_idx = M.contents_idx
                                WHERE C.delete_flag = 1 ORDER BY scrap_date DESC`;
    
    console.log(getScrapListQuery);
    
    const getScrapListResult = await db.queryParam_Arr(getDeletedListQuery,[]);

    if (!getScrapListResult) { //콘텐츠 idx 조회 실패했을 때
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.GET_SCRAP_LIST_FAIL));
    } else { 
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.GET_SCRAP_LIST_SUCCESS, getScrapListResult))
    }
});

module.exports = router;