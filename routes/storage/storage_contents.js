var express = require('express')
var router = express.Router()
const util = require('../../modules/utils/utils');
const statusCode = require('../../modules/utils/statusCode');
const resMessage = require('../../modules/utils/responseMessage');
const db = require('../../modules/pool')

router.put('/delete', async (req, res) => {
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
    SET delete_flag = true
    WHERE FIND_IN_SET(contents_idx,?);
    `

    db.Transaction(async (connection) => {
        let selectCountResult = await db.queryParam_Arr(checkValidIdxQuery, targetContents)
        if (selectCountResult[0].total !== targetContentsSize) {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NO_CONTENT))
        } else {
            let result = await db.queryParam_Arr(updateDeleteFlagQuery, targetContents)
            if (result == null) {
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
            } else {
                res.status(200).send(util.successTrue(statusCode.OK,resMessage.DELETE_CONTENTS_SUCCESS))
            }
        }
    }).catch(err => {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
        next(err)
    })
})

module.exports = router