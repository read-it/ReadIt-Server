var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const pool = require('../../config/dbConfig');
const db = require('../../module/pool');
const async = require('async');
//const upload = require('../../config/multer')

router.post('/', async (req, res)=>{
    
    const sameEmailQuery = 'SELECT email FROM User WHERE email = ?';

    try{
        var connection = await pool.getConnection();
        var result = await connection.query(sameEmailQuery, [req.body.email]) || null;

    } catch (err) {
        console.log(err);
        connection.rollback(() => {});
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.JOIN_FAIL));

    }finally{
        pool.releaseConnection(connection);
    }

    // same id exist
    if(!result){
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.JOIN_FAIL));

    }else if(result.length!=0){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_USER));
        
    }else{
        let insertUserQuery = 'INSERT INTO user (email,password,salt) VALUES (?, ?, ?)';

        const salt = await crypto.randomBytes(32);
        const hashedPw = await crypto.pbkdf2(req.body.password.toString(), salt.toString('base64'), 1000, 32, 'SHA512');

        try{
            connection = await pool.getConnection();
            result = await connection.query(insertUserQuery, [req.body.email, hashedPw.toString('base64'), salt.toString('base64')]) || null;

        } catch (err) {
            console.log(err);
            connection.rollback(() => {});
            res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.JOIN_FAIL));

        }finally{
            pool.releaseConnection(connection);

        }
        res.status(200).send(utils.successTrue(statusCode.CREATED, resMessage.CREATED_USER, {email: req.body.email, nickname: req.body.nickname}));

    }

});

module.exports = router;
