const express = require('express');
const router = express.Router();

const hangul = require('hangul-js');

const db = require('../../module/pool');
const authUtil = require('../../module/utils/authUtils');
const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.get('/', authUtil.isLoggedin, async(req, res) => {

	const userIdx = req.decoded.idx;

	//유저의 카테고리목록 조회
	const getCategoryQuery = `SELECT * FROM category WHERE user_idx = ${userIdx}`;
	const getCategoryResult = await db.queryParam_None(getCategoryQuery);

	if(!getCategoryResult){
		res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
	} else {
		const categoryList = new Object();
		for(var i = 0; i<getCategoryResult.length;i++){
			//전체 카테고리 넣어주기
			if(getCategoryResult[i].category_name == "전체")
				categoryList.defaultIdx = getCategoryResult[i].category_idx;
		}

		//카테고리 리스트 넣어주기
		categoryList.categoryInfo = getCategoryResult;

		res.status(200).send(util.successTrue(statusCode.OK, resMessage.CATEGORY_SELECT_SUCCESS,categoryList));
	}
})

router.get('/:category_idx', authUtil.isLoggedin, async(req, res) => {

	if(!category_idx){
		res.status(200).send(util.successFalse(statusCode.NO_CONTENT))
	}

	const userIdx = req.decoded.idx;

	//유저의 전체 카테고리 인덱스 가져오기
	const getDefaultIdxQuery = `SELECT category_idx FROM category WHERE user_idx = ${userIdx} AND category_name = "전체"`;
	const getDefaultIdxResult = await db.queryParam_None(getDefaultIdxQuery);

	//유저의 전체 콘텐츠 가져오기
	let getContentsListQuery = 
	`
	SELECT * FROM 
		(SELECT C.*, COUNT(H.highlight_idx)AS highlight_cnt 
			FROM contents C LEFT JOIN highlight H
			ON C.contents_idx=H.contents_idx
			GROUP BY C.contents_idx) S
	WHERE S.user_idx = ${userIdx}
	`;

	if(!getDefaultIdxResult){
		res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
	} else {
		//검색 카테고리가 전체인지 세부 카테고리인지 확인
		if(getDefaultIdxResult[0].category_idx != req.params.category_idx){

			//세부 카테고리일경우 쿼리문 추가
			getContentsListQuery = getContentsListQuery + ` AND S.category_idx = ${req.params.category_idx}`;
		}
		//검색할 콘텐츠 리스트 가져오기
		const getContentsListResult = await db.queryParam_None(getContentsListQuery);

		//검색어 search 함수
		const searcher = new hangul.Searcher(req.query.keyword);

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

			res.status(200).send(util.successTrue(statusCode.OK, resMessage.GET_SEARCH_RESULT_SUCCESS, findContentsList));
		}
	}
})
module.exports = router