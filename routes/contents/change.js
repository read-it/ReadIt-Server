const express = require('express')
const router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')

router.put('/:contents_idx/:category_idx',authUtils.isLoggedin,async(req,res) => {
    let selectCategoryQuery = 
    `
    SELECT count(*) as count
    FROM category
    WHERE user_idx = ? AND category_idx = ?
    `
    let updateContentsCategoryQuery = 
    `
    UPDATE contents
    SET category_idx = ?
    WHERE contents_idx = ?
    `
    let selectResult = await db.queryParam_Arr(selectCategoryQuery,[req.decoded.idx,req.params.category_idx])

    if(selectResult == null){
        return res.status(200).send(util.successFalse(statusCode.successFalse,resMessage.DB_ERROR))
    }
    else if(selectResult[0].count != 1){
        return res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
    }

    let updateResult = await db.queryParam_Arr(updateContentsCategoryQuery,[req.params.category_idx,req.params.contents_idx])

    if(updateResult == null){
        res.status(200).send(util.successFalse(statusCode.successFalse,resMessage.DB_ERROR))
    } else if(updateResult.affectedRows != 1) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
    }
    else {
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.CONTENTS_CATEGORY_CHANGE_SUCCESS))
    }
})

module.exports = router