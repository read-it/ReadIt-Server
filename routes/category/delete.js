var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const authUtils = require('../../module/utils/authUtils');

//let modifyResult1 = await db.queryParam_Arr(modifyQuery1, [req.params.category_idx]);
//res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

//카테고리 삭제시 1-> 카테고리만 삭제 2->카테고리 안에 있는 콘텐츠 모두 삭제
//delete_flag가 0일 경우 카테고리만 삭제, 1일 경우 전체 삭제
router.delete('/:category_idx/:delete_flag', authUtils.isLoggedin ,async (req, res) => {
    const user = req.decoded.idx;
    
    let category_idx = req.params.category_idx;
    let delete_flag = req.params.delete_flag;

    switch(delete_flag) {
        case '0' :
            let deleteFlag1Query = `DELETE C.* FROM category AS C WHERE category_idx= ? AND user_idx = '${req.body.email}'`
            let deleteFlag1Result = await db.queryParam_Arr(deleteFlag1Query, [category_idx]);
            if(!deleteFlag1Result) {
                res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(util.successFalse(statusCode.OK, resMessage.DELETE_CATE_SUCCESS));
            }
        case '1' :
            let deleteFlag2Query = ''
    }
});


module.exports = router;