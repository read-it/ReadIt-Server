var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtils = require('../../module/utils/authUtils');

//삭제된 콘텐츠 조회
router.get('/', authUtils.isLoggedin, async (req, res) => {
    
    const userIdx = req.decoded.idx;

    //user의 delete_flag = true 인 컨텐츠 목록
    const getDeletedListQuery = `
    SELECT  R.*,G.category_name FROM category G INNER JOIN
		(SELECT C.*, COUNT(H.highlight_idx) AS highlight_cnt FROM contents C LEFT JOIN highlight H
            ON C.contents_idx = H.contents_idx
            WHERE C.user_idx = ${userIdx} AND C.delete_flag = true
            GROUP BY C.contents_idx) R
        ON G.category_idx = R.category_idx
        ORDER BY R.estimate_time DESC`;
    
    const getDeletedListResult = await db.queryParam_None(getDeletedListQuery);

    if (!getDeletedListResult) {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.GET_DELETED_CONTENTS_FAIL));
    } else { 
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.GET_DELETED_CONTENTS_SUCCESS, getDeletedListResult))
    }
});

//영구삭제
router.delete('/', authUtils.isLoggedin, async (req, res) => {
    
    let targetContents = req.body.contents_idx_list.toString()
    let targetContentsSize = req.body.contents_idx_list.length
    console.log('targetSize : '+targetContentsSize)

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
        else if (selectCountResult[0].total != targetContentsSize) {
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
    // if (!deleteTransaction || deleteTransaction == undefined) {
    //     res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DELETED_CONTENTS_FAIL));
    // } else { 
    //     res.status(200).send(utils.successTrue(statusCode.OK, resMessage.DELETE_CONTENTS_COMPLETELY_SUCCESS))
    // }

    if(deleteTransaction){
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.DELETE_CONTENTS_COMPLETELY_SUCCESS))
    }
});

//삭제된 항목 복원
router.put('/', authUtils.isLoggedin, async (req, res) => {
    
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
    //선택한 항목들 복원
    let updateDeleteFlagQuery = 
    `
    UPDATE contents
    SET delete_flag = false
    WHERE FIND_IN_SET(contents_idx,?)
    `

    var restoreTransaction = await db.Transaction(async(connection) => {
        let selectCountResult = await connection.query(checkValidIdxQuery, [targetContents])
    
        if(!selectCountResult){
            //선택항목 조회 실패
            res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
        }
        else if (selectCountResult[0].total !== targetContentsSize) {
            //선택항목이 삭제된 콘텐츠가 아니거나 없는 콘텐츠
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NO_DELETED_CONTENT))
        } else {
            //선택항목들 복원
            const result = await connection.query(updateDeleteFlagQuery, [targetContents])
            if (!result) {
                res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
            }
        }
    })
    if (!restoreTransaction) {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.RESTORE_CONTENTS_FAIL));
    } else { 
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.RESTORE_CONTENTS_SUCCESS));
    }
});
module.exports = router;