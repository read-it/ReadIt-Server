var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const authUtil = require('../../module/utils/authUtils');
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

//카테고리 전체 조회
router.get('/', authUtil.isLoggedin,async (req, res) => {
    var user = req.decoded.idx;

    let selectCategoryQuery = `SELECT c.category_idx, c.category_name FROM category AS c WHERE c.user_idx = ${user} AND char_length(category_name) <= 5;`;
    let QueryResult = await db.queryParam_None(selectCategoryQuery);
    if(!QueryResult) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.CATEGORY_SELECT_SUCCESS,  {category_list : QueryResult}));
    }
});

//카테고리 추가
router.post('/', async (req, res) => {
    let targetContents = req.body.contents_idx_list.toString()
    let targetContentsSize = req.body.contents_idx_list.length

    //선택한 항목이 삭제된 항목인지 확인
    let checkValidIdxQuery =
    `
    SELECT count(*) as total
    FROM contents
    WHERE FIND_IN_SET(contents_idx, ?)
    AND delete_flag = true;
    `
    //선택한 항목들 삭제
    let deleteContentsQuery =
    `
    DELETE FROM contents
    WHERE FIND_IN_SET(contents_idx,?);
    `

    var deleteTransaction = await db.Transaction(async(connection) => {
        let selectCountResult = await connection.query(checkValidIdxQuery, [targetContents])
    
        if(!selectCountResult){
            //선택항목 조회 실패
            res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
        }
        else if (selectCountResult[0].total !== targetContentsSize) {
            //선택항목이 삭제된 콘텐츠가 아니거나 없는 콘텐츠
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NO_DELETED_CONTENT))
        } else {
            //선택항목들 삭제
            const result = await connection.query(deleteContentsQuery, [targetContents])
            if (!result) {
                res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
            }
        }
    })
    if (!deleteTransaction) {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DELETED_CONTENTS_FAIL));
    } else { 
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.DELETE_CONTENTS_COMPLETELY_SUCCESS))
    }
});


module.exports = router;
