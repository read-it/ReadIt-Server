const express = require('express');
const router = express.Router();
const ogs = require('open-graph-scraper');
const moment = require('moment');
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');

router.post('/',authUtils.isLoggedin,async (req, res) => {
    let category_idx = req.body.category_idx
    let contents_url = req.body.contents_url

    let selectCategory =
    `
    SELECT *
    FROM category
    WHERE category_name = '전체' AND user_idx = ${req.decoded.idx}
    `


    if(category_idx == null || category_idx == undefined){
        let selectResult = await db.queryParam_None(selectCategory)
        if(!selectResult){
            category_idx = selectResult[0].category_idx
        } else {
            return res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        }
    }    
    var options = {}
    var contentsInfo = {
        contentsSiteName: '',
        contentsName: '',
        contentsUrl: '',
        contentsTitle: '',
        contentsImage: ''
    }
    options.url = contents_url

    let result = await ogs(options)

    if(result.success){
        contentsInfo.contentsUrl = contents_url
        contentsInfo.contentsSiteName = util.cutSiteUrl(contents_url)
        contentsInfo.contentsTitle = result.data.ogTitle,
        contentsInfo.contentsImage = result.data.ogImage.url
        
        console.log(contentsInfo)

        let insertContentsQuery = 
        `
        INSERT INTO contents
        (title,thumbnail,created_date,estimate_time,contents_url,site_url,category_idx,user_idx)
        VALUES (?,?,?,?,?,?,?,?);
        `
        var createDate = moment().format("YYYY-MM-DD")
        let insertContentsResult = await db.queryParam_Arr(insertContentsQuery,
            [contentsInfo.contentsTitle,contentsInfo.contentsImage,createDate,'7분',
            contentsInfo.contentsUrl,contentsInfo.contentsSiteName,category_idx,req.decoded.idx])
        if(insertContentsResult != null){
            console.log(insertContentsResult)
            console.log(contentsInfo)
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.ADD_CONTENTS_SUCCESS))
        } else {
            console.log(insertContentsResult)
            console.log(contentsInfo)
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        }

    } else {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.BAD_REQUEST))
    }
});


module.exports = router