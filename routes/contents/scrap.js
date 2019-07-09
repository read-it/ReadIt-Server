const express = require('express')
const router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')
const moment = require('moment')

router.put('/:contents_idx',authUtils.isLoggedin, async (req,res) => {
    let selectContentsQuery = 
    `
    SELECT count(*) as count
    FROM contents
    WHERE user_idx = ${req.decoded.idx} AND contents_idx = ${req.params.contents_idx}
    `
    let selectScrapQuery = 
    `
    SELECT * 
    FROM scrap
    WHERE contents_idx = ${req.params.contents_idx}
    `

    let deleteScrapQuery = 
    `
    DELETE 
    FROM scrap
    WHERE contents_idx = ? AND user_idx = ${req.decoded.idx}
    `

    let insertScrapQuery = 
    `
    INSERT INTO scrap
    (contents_idx,user_idx,scrap_date) VALUES (?,?,?)
    `

    let selectContentsResult = await db.queryParam_None(selectContentsQuery)
    if(selectContentsResult == null){
        console.log("콘텐츠 DB ERROR")
        return res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    } else if(selectContentsResult[0].count != 1){
        console.log("본인의 컨텐츠가 아님")
        return res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.OUT_OF_VALUE))
    }
    let selectScrapResult = await db.queryParam_None(selectScrapQuery)
    if(selectScrapResult == null){
        console.log("스크랩 DB ERROR")
        return res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    } else if(selectScrapResult.length == 1){ //스크랩 존재하는 경우
        var deleteResult = await db.queryParam_Arr(deleteScrapQuery,[selectScrapResult[0].contents_idx])
        if(deleteResult == null){
            console.log("삭제 실패")
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        } else {
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.SCRAP_DELETE_SUCCESS))
        }
    } else { //스크랩 없는 경우
        var insertResult = await db.queryParam_Arr(insertScrapQuery,[req.params.contents_idx , req.decoded.idx,moment().format("YYYY-MM-DD")])
        if(insertResult == null){
            console.log("스크랩 실패")
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        } else {
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.SCRAP_SUCCESS))
        }
    }
})

module.exports = router