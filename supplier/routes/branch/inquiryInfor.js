var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');

router.get('/inquiryInfor', function(req, res, next) {
    var data={};
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    var token = req.signedCookies.supplierCookie ? req.signedCookies.supplierCookie.token : '';
    if (token) {
        headers.access_token = token
    }




    common.active(data, req);

    res.render('inquiryInfor',data);
});

//议价列表的操作
router.post('/enquiry/bargainManager',function(req , res , next){
    asyncRequst.singleRequest('/enquiry/bargainManager','post',req,res,function(data){
        res.send(data);
    })
});



module.exports = router;
