const express = require('express')
const router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')
const moment = require('moment')

router.put('/:contents_idx',authUtils.isLoggedin, async(req ,res) => {
    let selectFixedContentsQuery = 
    `
    SELECT *
    FROM contents
    WHERE user_idx = ? AND fixed_date IS NOT NULL
    `
    let updateFixedContentsQuery = 
    `
    UPDATE contents
    SET fixed_date = ?
    WHERE contents_idx = ?
    `

    let selectResult = await db.queryParam_Arr(selectFixedContentsQuery,[req.decoded.idx])

    if(selectResult == null){
        console.log(selectResult)
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    } else if(test(selectResult,req.params.contents_idx)){
        var updateResult = await db.queryParam_Arr(updateFixedContentsQuery,[null,req.params.contents_idx])
        if(updateResult != null){
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.UN_FIX_SUCCESS))
        } else {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        }
    } else if(selectResult.length == 2){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_FIX))
    } else { 
        var updateResult = await db.queryParam_Arr(updateFixedContentsQuery,[moment().format('YYYY-MM-DD'),req.params.contents_idx])
        if(updateResult != null){
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.FIX_SUCCESS))
        } else {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        }
    }

    function test(selectResult,contents_idx){
        var check = false
        selectResult.forEach(function(result){
            if(result.contents_idx == contents_idx){
                check = true
                return 
            }
        })
        return check
    }
})

module.exports = router