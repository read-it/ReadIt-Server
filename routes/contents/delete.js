const express = require('express')
const router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')

router.put('/:contents_idx',authUtils.isLoggedin,async(req, res) => {
    let selectContentsQuery = 
    `
    SELECT count(*) as count
    FROM contents
    WHERE user_idx = ? AND contents_idx = ?
    `

    let updateContentsQuery = 
    `
    UPDATE contents
    SET delete_flag = true
    WHERE contents_idx = ?
    `

    var selectResult = await db.queryParam_Arr(selectContentsQuery,[req.decoded.idx,req.params.contents_idx])
    if(selectResult == 0){
        return res.status(200).send(util.successFalse(statusCode.successFalse,resMessage.DB_ERROR))
    }
    else if(selectResult[0].count != 1){
        return res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
    }

    var updateResult = await db.queryParam_Arr(updateContentsQuery,[req.params.contents_idx])

    if(updateResult == null){
        res.status(200).send(util.successFalse(statusCode(statusCode.DB_ERROR,resMessage.DB_ERROR)))
    } else if(updateResult.affectedRows != 1){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
    } else {
        res.status(200).send(util.successTrue(statusCode.statusCode.OK,resMessage.DELETE_CONTENTS_SUCCESS))
    }
})

module.exports = router