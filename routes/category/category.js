var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const authUtil = require('../../module/utils/authUtils');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

//카테고리 전체 조회
router.get('/', authUtil.isLoggedin,async (req, res) => {
    var user = req.decoded.idx;

    let selectCategoryQuery = `SELECT c.category_idx, c.category_name FROM category AS c WHERE c.user_idx = ${user} AND char_length(category_name) <= 5 ORDER BY category_order DESC`;
    let QueryResult = await db.queryParam_None(selectCategoryQuery);
    if(!QueryResult) {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.CATEGORY_SELECT_SUCCESS,  {category_list : QueryResult}));
    }
});

//카테고리 추가
router.post('/',authUtil.isLoggedin ,async (req, res) => {
    const user = req.decoded.idx;
    const contents_idx = req.body.contents_idx.toString();

    const selectQuery = `SELECT category_idx, category_name FROM category WHERE user_idx = ? AND category_name = ?`;

    const insertQuery = `INSERT INTO category (category_name, user_idx) VALUES (?,?)`;  
    //const updateQuery =`UPDATE contents SET category_idx = ? WHERE contents_idx = ?;`
    const updateQuery = `UPDATE contents SET category_idx = ? WHERE FIND_IN_SET(contents_idx, ?)`;

    const selectResult = await db.queryParam_Arr(selectQuery, [user, req.body.category_name]);
    
    console.log(selectResult[0])
    // 카테고리 이름 중복 체크
    if(!selectResult) {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }else if(selectResult[0]){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_CATE_NAME));
    } else {
        
        const insertTransaction = await db.Transaction(async(connection) => {
            const insertResult = await connection.query(insertQuery, [req.body.category_name, user]);
            const idx = insertResult.insertId;

            if(contentsArray.length!=0){
                const updateResult = await connection.query(updateQuery, [idx, contentsArray]);
            }

            // try{
            //     // for(var i=0; i<updateResult)
            // } catch {
            //     // 에러 부분 db rollback
            // }
            
        });

        if (!insertTransaction) {
            res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.CREATED_CATEGORY_FAIL));
        } else { 
            res.status(200).send(utils.successTrue(statusCode.CREATED, resMessage.CREATED_CATEGORY_SUCCESS));
        }
    }
});


module.exports = router;
