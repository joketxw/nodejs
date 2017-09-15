var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');


//消息中心
router.get('/supplierNews/newsList', function(req, res, next) {

    var data={};
    common.active(data, req);

    res.render('supplierNews/newsList',data);
});

//查询供应商消息列表
router.post('/supplierNews/show',function(req , res , next){
    asyncRequst.singleRequest('/supplierNews/show','post',req,res,function(data){
        res.send(data);
    })
});
//修改消息状态
router.post('/supplierNews/modifyState',function(req , res , next){
    asyncRequst.singleRequest('/supplierNews/modifyState','post',req,res,function(data){
        res.send(data);
    })
});
//删除消息
router.post('/supplierNews/remove',function(req , res , next){
    asyncRequst.singleRequest('/supplierNews/remove','post',req,res,function(data){
        res.send(data);
    })
});
module.exports = router;