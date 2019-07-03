const express = require('express')
const router = express.Router()
const util = require('../../modules/utils/utils');
const statusCode = require('../../modules/utils/statusCode');
const resMessage = require('../../modules/utils/responseMessage');
const db = require('../../modules/pool')

router.get('/:category_idx/:sort', async (req, res) => {
    let findContentsByCategory =
        `
    SELECT G.category_name, M.* FROM category G LEFT JOIN
(SELECT C.*, COUNT(H.highlight_idx) AS highlight_cnt FROM contents C LEFT JOIN highlight H
ON C.contents_idx = H.contents_idx
GROUP BY C.contents_idx) M
ON G.category_idx  = M.category_idx
WHERE G.category_idx = ?
ORDER BY`

    switch (req.params.sort) {
        //최신순
        case '1': {
            findContentsByCategory = findContentsByCategory.concat(' M.created_date DESC, M.contents_idx')
            break;
        }
        //오래된 순
        case '2': {
            findContentsByCategory = findContentsByCategory.concat(' M.created_date ASEC, M.contents_idx')
            break;
        }
        //안읽은 순
        case '3': {
            findContentsByCategory = findContentsByCategory.concat(' M.read_flag, M.created_date, M.contents_idx')
            break;
        }
        //소요시간 순 -> 수정 필요
        case '4': {
            findContentsByCategory = findContentsByCategory.concat(' M.contents_idx DESC')
            break;
        }
    }

    let findResult = await db.queryParam_Arr(findContentsByCategory, [req.params.category_idx])

    if (findResult != null){
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.CATEGORY_SELECT_SUCCESS,findResult))
    } else {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    }

})

module.exports = router