var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');
//订单中心
router.get('/orderCenter', function(req, res, next) {

    var data={};
    common.active(data, req);

    res.render('orderCenter',data);
});
//月结订单
router.get('/monthlyOrder', function(req, res, next) {

    var data={};
    common.active(data, req);
    res.render('monthlyOrder',data);
});

//查订单列表
router.post('/supplierOrder/pageList',function(req , res , next){
    asyncRequst.singleRequest('/supplierOrder/pageList','post',req,res,function(data){
        res.send(data);
    })
});
//月结订单列表
router.post('/supplierOrder/monthPageList',function(req , res , next){
    asyncRequst.singleRequest('/supplierOrder/monthPageList','post',req,res,function(data){
        res.send(data);
    })
});



//发货
router.post('/supplierOrder/updateOrder',function(req , res , next){
    asyncRequst.singleRequest('/supplierOrder/updateOrder','post',req,res,function(data){
        res.send(data);
    })
});
module.exports = router;