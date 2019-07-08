const express = require('express');
const router = express.Router();

const _ = require('lodash')
const hangul = require('hangul-js');

const db = require('../../module/pool');
const authUtil = require('../../module/utils/authUtils');
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.get('/', authUtil.isLoggedin, async(req, res) => {

	const userIdx = req.decoded.idx;

	//검색어 search 함수
	const searcher = new hangul.Searcher(req.query.keyword);

	//유저의 콘텐츠 가져오기
	const getContentsListQuery = 
	`
	SELECT * FROM 
		(SELECT C.*, COUNT(H.highlight_idx)AS highlight_cnt 
			FROM contents C LEFT JOIN highlight H
			ON C.contents_idx=H.contents_idx
			GROUP BY C.contents_idx) S
	WHERE S.user_idx = ${userIdx}
	`;

	const getContentsListResult = await db.queryParam_None(getContentsListQuery);

	if(!getContentsListResult){

		res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));

	} else{
		//제목에 검색어가 포함된 콘텐츠를 담을 배열
		const findContentsList = new Array();

		for(var i =0 ; i<getContentsListResult.length; i++){
			if(searcher.search(getContentsListResult[i].title)>=0){
				findContentsList.push(getContentsListResult[i]); 
			}
		}

		console.log(findContentsList);

		res.status(200).send(util.successTrue(statusCode.OK, resMessage.GET_SEARCH_RESULT_SUCCESS, findContentsList));
	}
})
module.exports = router