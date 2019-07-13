const express = require('express')
const router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const jwt = require('../../module/jwt')
const authUtils = require('../../module/utils/authUtils')
const moment = require('moment')

router.get('/:category_idx/:sort',authUtils.isLoggedin, async (req, res) => {
    const contentsSelectTransaction = await db.Transaction(async(connection) => {
        let selectCategoryNameQuery = 
            `
            SELECT category_name
            FROM category
            WHERE category_idx = ?
            `

        let findContentsByCategory =
            `SELECT  R.*,G.category_name FROM category G INNER JOIN
			(SELECT M.*, if(isnull(S.scrap_date),false,true) as scrap_flag FROM scrap as S RIGHT JOIN 
			(SELECT C.*, COUNT(H.highlight_idx) AS highlight_cnt FROM contents C LEFT JOIN highlight H
            ON C.contents_idx = H.contents_idx
            GROUP BY C.contents_idx) M
            ON S.contents_idx = M.contents_idx) R
            ON G.category_idx = R.category_idx
            WHERE G.category_idx = ? AND R.delete_flag = false
            ORDER BY `
        
        var queryVariable
        var selectCategoryNameResult = await connection.query(selectCategoryNameQuery,[req.params.category_idx])
        if(selectCategoryNameResult.length != 1){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.BAD_REQUEST))
        } else if(selectCategoryNameResult[0].category_name == '전체'){
            findContentsByCategory = 
            `SELECT  R.*,G.category_name FROM category G INNER JOIN
			(SELECT M.*, if(isnull(S.scrap_date),false,true) as scrap_flag FROM scrap as S RIGHT JOIN 
			(SELECT C.*, COUNT(H.highlight_idx) AS highlight_cnt FROM contents C LEFT JOIN highlight H
            ON C.contents_idx = H.contents_idx
            WHERE C.user_idx = ? AND C.delete_flag = false
            GROUP BY C.contents_idx) M
            ON S.contents_idx = M.contents_idx) R
            ON G.category_idx = R.category_idx
            ORDER BY`

            queryVariable = req.decoded.idx
        } else {
            queryVariable = req.params.category_idx
        }
        
        switch (req.params.sort) {
            //최신순
            case '1': {
                findContentsByCategory = findContentsByCategory.concat(' R.fixed_date DESC,R.created_date DESC, R.contents_idx DESC')
                break;
            }
            //오래된 순
            case '2': {
                findContentsByCategory = findContentsByCategory.concat(' R.fixed_date DESC,R.created_date ASC, R.contents_idx')
                break;
            }
            //안읽은 순
            case '3': {
                findContentsByCategory = findContentsByCategory.concat(' R.fixed_date DESC,R.read_flag, R.created_date, R.contents_idx DESC')
                break;
            }
            //소요시간 순 -> 수정 필요
            case '4': {
                findContentsByCategory = findContentsByCategory.concat(' R.fixed_date DESC,R.contents_idx DESC')
                break;
            }
        }

        let findResult = await connection.query(findContentsByCategory, [queryVariable])
        if (findResult != null){
            var unReadCount = 0;
            var data = {}
            findResult.forEach(function(contents){
                if(!contents.read_flag) {
                    unReadCount++;
                }
            })
            data.total_count = findResult.length
            data.unread_count = unReadCount
            data.current_date = moment().format('YYYY-MM-DD')
            data.contents_list = util.insertAfterCreateDateAtResult(findResult)
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.CATEGORY_SELECT_SUCCESS,data))
        } else {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        }
    })
    if(contentsSelectTransaction == null || contentsSelectTransaction == undefined){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    }
})

module.exports = router