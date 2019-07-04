var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.put('/:category_idx', async (req, res) => {
    let category_idx = req.params.category_idx;
    let modifyQuery = `UPDATE category SET category_name = '?' WHERE category_idx = ?;`
    let modifyResult = await db.queryParam_Arr(modifyQuery, [req.body.category_name, category_idx]);
    if(!modifyResult) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.UNCLASSIFIED_CATE_SELECT_SUCCESS,  modifyResult));
    }
});

module.exports = router;

