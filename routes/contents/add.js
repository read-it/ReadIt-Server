const express = require('express')
const router = express.Router()
const ogs = require('open-graph-scraper')
const moment = require('moment')
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')

router.post('/', async (req, res) => {
    let category_idx = req.body.category_idx
    let contents_url = req.body.contents_url
    
    var options = {}
    var contentsInfo = {
        contentsSiteName: '',
        contentsTwitterSite: '',
        contentsName: '',
        contentsUrl: '',
        contentsTitle: '',
        contentsImage: ''
    }
    options.url = contents_url

    let result = await ogs(options)

    if(result.success){

        contentsInfo.contentsSiteName = result.data.ogSiteName
        contentsInfo.contentsTwitterSite = result.data.twitterSite
        contentsInfo.contentsName = result.data.ogSiteName
        contentsInfo.contentsUrl = result.data.ogUrl
        contentsInfo.contentsTitle = result.data.ogTitle,
        contentsInfo.contentsImage = result.data.ogImage.url

        let insertContentsQuery = 
        `
        INSERT INTO contents
        (title,thumbnail,created_date,estimate_time,contents_url,category_idx)
        VALUES (?,?,?,?,?,?);
        `
        var createDate = moment().format("YYYY-MM-DD")
        let insertContentsResult = await db.queryParam_Arr(insertContentsQuery,
            [contentsInfo.contentsSiteName,contentsInfo.contentsImage,createDate,'7분',contentsInfo.contentsUrl,category_idx])
        if(insertContentsResult != null){
            console.log(insertContentsResult)
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.ADD_CONTENTS_SUCCESS))
        } else {
            console.log(insertContentsResult)
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        }

    } else {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.BAD_REQUEST))
    }
})

module.exports = router