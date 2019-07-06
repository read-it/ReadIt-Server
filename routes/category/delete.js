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

    let deleteFlag1Query = `DELETE category_idx, category_name FROM category WHERE category_idx= ?`;
    let deleteFlag1Result = await db.queryParam_Arr(deleteFlag1Query, [category_idx, user]);

    console.log(deleteFlag1Result)
    if(!deleteFlag1Result) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_CATE_IDX));
    } else {
        if(deleteFlag1Result[0].category_name == '전체') {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_CATE_IDX))
        }
        if(deleteFlag1Result.affectedRows != 1) {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.INVALID_CATE_IDX));
        }
            res.status(200).send(util.successFalse(statusCode.OK, resMessage.DELETE_CATE_SUCCESS));
    } 
    
    switch(delete_flag) {
        case '0' :
            

        case '1' :
            deleteFlag1Query = deleteFlag1Query.concat(' AND user_idx = user');
            let deleteFlag2Query = ''
    }
});


module.exports = router;