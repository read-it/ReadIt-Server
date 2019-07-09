var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const authUtil = require('../../module/utils/authUtils');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const moment = require('moment');

router.put('/',authUtil.isLoggedin,async (req,res) => {
    let categoryOrders = req.body.category_orders
    let updateOrderQuery = 
    `
    UPDATE category SET category_order = ?
    WHERE category_idx = ? 
    `

    let updateTransaction = await db.Transaction(async(connection)=>{
        for(i = 0 ;i < categoryOrders.length ; i++){
            console.log(categoryOrders[i])
            var updateOrderResult = await connection.query(updateOrderQuery,[categoryOrders.length - i,categoryOrders[i]])
        }
    })

    if(updateTransaction == undefined){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.DB_ERROR))
    } else {
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.CATEGORY_ORDER_CHANGE_SUCCESS))
    }
})

module.exports = router