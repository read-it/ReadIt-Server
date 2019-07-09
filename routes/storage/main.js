var express = require('express')
var router = express.Router()
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool')
const authUtils = require('../../module/utils/authUtils')
const moment = require('moment')

router.get('/',authUtils.isLoggedin,async (req, res) => {
    let selectUserQuery = `
    SELECT profile_img,nickname
    FROM user
    WHERE user_idx = ?
    `
    let selectCategoriesQuery = `
    SELECT category_idx, category_name
    FROM category
    WHERE user_idx = ?
    `
    let selectTotalContentsQuery = `
    SELECT  R.*,G.category_name FROM category G INNER JOIN
			(SELECT M.*, if(isnull(S.scrap_date),false,true) as scrap_flag FROM scrap as S RIGHT JOIN 
			(SELECT C.*, COUNT(H.highlight_idx) AS highlight_cnt FROM contents C LEFT JOIN highlight H
            ON C.contents_idx = H.contents_idx
            WHERE C.user_idx = ? AND C.delete_flag = false
            GROUP BY C.contents_idx) M
            ON S.contents_idx = M.contents_idx) R
            ON G.category_idx = R.category_idx
            ORDER BY R.fixed_date DESC, R.created_date DESC
    `

    const getStorageMainTransacion = await db.Transaction(async(connection) => {
        var selectUserResult = await connection.query(selectUserQuery,[req.decoded.idx])
        var selectCategoriesResult = await connection.query(selectCategoriesQuery,[req.decoded.idx])
        var selectTotalContentsResult = await connection.query(selectTotalContentsQuery,[req.decoded.idx])

        if(selectUserResult != null && selectCategoriesResult != null && selectTotalContentsResult != null){
            var data = {}
            var unReadCount = 0
            data = selectUserResult[0]
            data.category_list = selectCategoriesResult            
            selectTotalContentsResult.forEach(function(contents){
                if(!contents.read_flag){
                    unReadCount++
                }
            })
            data.current_date = moment().format('YYYY-MM-DD')
            data.total_count = selectTotalContentsResult.length
            data.unread_count = unReadCount
            data.contents_list = selectTotalContentsResult
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.STORAGE_MAIN_SUCCESS,data))
        } else {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
        }
    })
    if(getStorageMainTransacion == null){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    }
})

module.exports = router;