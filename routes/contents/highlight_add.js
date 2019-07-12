const express = require('express')
const router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')
const moment = require('moment')
router.post('/add/:contents_idx',authUtils.isLoggedin,async(req, res) => {
    let highlight = req.body.highlight
    let jsonHighLight = JSON.parse(highlight)
    let insertHighlightQuery = 
    `
    INSERT INTO highlight
    (contents_idx,highlight_date,highlight_rect,highlight_text,hightlight_color)
    VALUES (?,?,?)
    `

    let insertResult = await db.queryParam_Arr(insertHighlightQuery,
        [req.params.contents_idx,moment().format('YYYY-MM-DD'),jsonHighLight.result,jsonHighLight.highlight_text,jsonHighLight.color])

    if(insertResult){
        res.status(200).send(util.successTrue(statusCode.OK,'하이라이트 성공'))
    } else {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    }
})

module.exports = router