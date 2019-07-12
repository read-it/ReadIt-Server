var express = require('express')
var router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')
const moment = require('moment');

router.post('/:type',authUtils.isLoggedin, async (req, res) => {
    let targetContents = req.body.contents_idx_list.toString()
    let targetContentsSize = req.body.contents_idx_list.length

    let checkValidIdxQuery =
    `
    SELECT count(*) as total
    FROM contents
    WHERE FIND_IN_SET(contents_idx, ?);
    `
    let updateDeleteFlagQuery =
    `
    UPDATE contents
    SET delete_flag = true, estimate_time = ?
    WHERE FIND_IN_SET(contents_idx,?);
    `
    let updateReadFlagQuery = 
    `
    UPDATE contents
    SET read_flag = true
    WHERE FIND_IN_SET(contents_idx,?)
    `

    var editTransaction = await db.Transaction(async(connection) => {
        let selectCountResult = await connection.query(checkValidIdxQuery, [targetContents])
        if(selectCountResult == null){
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
        }
        else if (selectCountResult[0].total !== targetContentsSize) {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NO_CONTENT))
        } else {
            var result
            if(req.params.type == 1){
                result = await connection.query(updateDeleteFlagQuery, [moment().format('YYYY-MM-DD HH:mm:ss'), targetContents]);
                if (result == null) {
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
                } else {
                    res.status(200).send(util.successTrue(statusCode.OK,resMessage.DELETE_CONTENTS_SUCCESS))
                }
            } else if(req.params.type == 2){
                result = await connection.query(updateReadFlagQuery, [targetContents])
                if (result == null) {
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
                } else {
                    res.status(200).send(util.successTrue(statusCode.OK,resMessage.READ_CONTENTS_SUCCESS))
                }
            } else {
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
            }
        }
    })
    if(!editTransaction || editTransaction == undefined){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
    }
})

module.exports = router