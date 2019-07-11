var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const authUtils = require('../../module/utils/authUtils');

//카테고리 삭제시 0-> 카테고리만 삭제 1->카테고리 안에 있는 콘텐츠 모두 휴지통
router.put('/:category_idx/:delete_flag', authUtils.isLoggedin, async (req, res) => {

    const user = req.decoded.idx;

    const category_idx = req.params.category_idx;
    const delete_flag = req.params.delete_flag;
    const default_idx = Number(req.body.default_idx); //유저가 갖고 있는 '전체' 카테고리 idx

    const config = `set SQL_SAFE_UPDATES = 0; `;

    const baseQuery = `WHERE contents_idx in (select m.contents_idx FROM (SELECT * from contents where user_idx = ${user} AND category_idx = ${category_idx}) AS m)`;

    // const selectIdxQuery = `SELECT contents_idx FROM contents WHERE user_idx = ${user} AND category_idx = ?`;
    // const userCateQuery = `SELECT cate.user_idx, cate.category_name, cate.category_idx FROM category AS cate WHERE cate.user_idx = ${user} AND cate.category_name LIKE '전체'`
    // const updateQuery = `UPDATE con SET category_idx = ? WHERE FIND_IN_SET(contents_idx, ?)`;
    const deleteQuery = `DELETE FROM category WHERE category_idx = ?`

        // console.log(selectIdxResult);
        // for(var i = 0; i < selectIdxResult.length; i++) {
        //     contentsArray.push(selectIdxResult[i].contents_idx);
        // }
        // console.log(selectIdxResult);
        // console.log(selectIdxResult[0].contents_idx);
        
        // const updateResult = await connection.query(updateQuery, [default_idx, selectIdxResult[0].contents_idx]);
        

        var Query 

        switch(delete_flag) {
            case '0' : 
                Query = `UPDATE contents set category_idx = ${default_idx} ` + baseQuery;
                break;
            
            case '1' : 
                Query = `UPDATE contents set category_idx = ${default_idx}, delete_flag = 1 ` + baseQuery;
                console.log(Query);
                break;
        }

        var deleteTransaction = await db.Transaction(async(connection) => {
            const toggleSafeMode = await connection.query(config)
            const QueryResult = await connection.query(Query);
//, [default_idx, category_idx]
        if(!QueryResult){
            //선택항목 조회 실패
            res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
        } else {
            //선택항목들 삭제
            const result = await connection.query(deleteQuery, [category_idx])
            if (!result) {
                res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR))
            }
        }
    })
    
    if (!deleteTransaction) {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else { 
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.DELETE_CATE_SUCCESS));
    }

});


module.exports = router;







