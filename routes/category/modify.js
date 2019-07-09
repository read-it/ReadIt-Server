var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtil = require('../../module/utils/authUtils');

router.put('/:category_idx', authUtil.isLoggedin, async (req, res) => {
    const user = req.decoded.idx;

    let modifyQuery1 = `SELECT c.category_name FROM category AS c WHERE category_idx=? AND c.user_idx = ${user}`;
    let modifyResult1 = await db.queryParam_Arr(modifyQuery1, [req.params.category_idx,user]);
    if(!modifyResult1) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        //카테고리 유효성 검사 1.'전체'인지 검사  2. 이미 있는 카테고리인지 검사 3. 카테고리 글자수 검사 4. '전체' 변경 fail 처리
        if(modifyResult1[0].category_name == '전체') {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.CATE_MODIFY_FAIL));
        } else if(modifyResult1[0].category_name == req.body.category_name ) {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_CATE_NAME));
        } else if(req.body.category_name.length > 5 ){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_CATE));
        } else if(req.body.category_name == '전체') {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_CATE_NAME));
        } else {
            let modifyQuery2 = `UPDATE category SET category_name =? WHERE category_idx = ?`;
            let modifyResult2 = await db.queryParam_Arr(modifyQuery2, [req.body.category_name, req.params.category_idx]);
            if(!modifyResult2) {
                res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.MODIFY_CATE_SUCCESS));
            }
        }
    
    }
});

module.exports = router;
