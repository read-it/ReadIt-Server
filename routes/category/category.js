var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

//카테고리 전체 조회
router.get('/', async (req, res) => {
    let selectCategoryQuery = 'SELECT category_idx, category_name FROM category WHERE char_length(category_name) <= 5;';
    let QueryResult = await db.queryParam_None(selectCategoryQuery);
    if(!QueryResult) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.CATEGORY_SELECT_SUCCESS,  {category_list : QueryResult}));
    }
});

//카테고리 추가
router.post('/', async (req, res) => {
    
});


module.exports = router;
