const express = require('express');
const router = express.Router();

const _ = require('lodash')

const db = require('../../module/pool');
const authUtil = require('../../module/utils/authUtils');
const hangulUtil = require('../../module/utils/hangulUtils');
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.get('/', authUtil.isLoggedin, async(req, res) => {

	const userIdx = req.decoded.idx;

	//단어 자음 모음으로 쪼개기
	var targetWord = hangulUtil(req.query.keyword);
	var extractQueryWord = "%" + targetWord + "%";

	const getTitleListQuery = `SELECT title FROM contents WHERE user_idx = ${userIdx}`;
	const getTitleListResult = await db.queryParam_None(getTitleListQuery);

	const titleJson = JSON.parse(getTitleListResult);

	console.log(titleJson);

	const extractTitleList = new Array;
	for(var i = 0; i < getTitleListResult.length; i++ ){
		extractTitleList.push(hangulUtil(getTitleListResult[i].title));
	}

	
	var similarTitleList = _.filter(extractTitleList, (obj) =>{
		return obj.title.startWith(extractQueryWord) ;
	});

	console.log(similarTitleList);

	// 쿼리스트링 양쪽에 % 붙이기
	var queryWord = "%" + req.query.keyword + "%";

	//타이틀에 keyword(완성 단어)들어간 콘텐츠 select 
	const getContentsTitleQuery = `SELECT * FROM contents WHERE title LIKE "${queryWord}" LIMIT 20`;
	//const getContentsTitleQuery = `SELECT * FROM contents WHERE title LIKE "%` + req.params.keyword + `%" LIMIT 20`;
	//const getContentsTitleQuery = `SELECT title FROM contents WHERE user_idx = ${userIdx}`;
	const getContentsTitleResult = await db.queryParam_None(getContentsTitleQuery);

	res.status(200).send(util.successTrue(statusCode.OK, "ㅇㅇㅇ완성", getContentsTitleResult));

})
module.exports = router