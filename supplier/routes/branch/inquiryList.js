var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');

router.get('/inquiryList', function(req, res, next) {

    var data={};
    common.active(data, req);

    res.render('inquiryList',data);
});

//获取询价列表
router.post('/enquiry/searchSupplierEnquirySheet',function(req , res , next){
    asyncRequst.singleRequest('/enquiry/searchSupplierEnquirySheet','post',req,res,function(data){
        res.send(data);
    })
});

//议价信息
router.post('/enquiry/searchBargain',function(req , res , next){
    asyncRequst.singleRequest('/enquiry/searchBargain','post',req,res,function(data){
        res.send(data);
    })
});


module.exports = router;
