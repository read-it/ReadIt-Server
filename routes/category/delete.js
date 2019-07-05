var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

//카테고리 삭제시 1-> 카테고리만 삭제 2->카테고리 안에 있는 콘텐츠 모두 삭제
//delete_flag가 0일 경우 카테고리만 삭제, 1일 경우 전체 삭제
router.delete('/:category_idx/:delete_flag', async (req, res) => {
    let delete_flag = req.params.delete_flag;
    let deleteQuery = 'DELETE C.* FROM category AS C WHERE '
    switch(delete_flag) {
        case '0' :
        
        case '1' :
    }
});


module.exports = router;