var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');

router.get('/personCenter', function(req, res, next) {
    var data = {};
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    var token = req.signedCookies.supplierCookie ? req.signedCookies.supplierCookie.token : '';
    if (token) {
        headers.access_token = token
    }
    async.parallel({
        homePageInfo: function (done) {
            var options = {
                method: 'POST',
                url: config.ip.host +':'+ config.ip.port + '/childAccount/getPersonInfo',
                headers: headers,
            };
            request(options, function (err, response, body) {
                if (!err) {
                    done(null, body)
                } else {
                    done(err, null)
                }
            });
        },
    }, function (error, result) {
        if (!error) {
            data.homePageInfo = JSON.parse(result.homePageInfo);
            console.log("***222222"+result.homePageInfo);
            common.active(data, req);
            res.render('personCenter',data);
        } else {
            console.log("error" + error);
        }
    });
});


//子账户管理
router.get('/personCenter/childAccountManagement', function(req, res, next) {

    var data={};
    common.active(data, req);

    res.render('personCenter/childAccountManagement',data);
});
//提现记录
router.get('/personCenter/presentationRecord', function(req, res, next) {

    var data={};
    common.active(data, req);

    res.render('personCenter/presentationRecord',data);
});

//资金记录
router.get('/personCenter/capitalRecord', function(req, res, next) {

    var data={};
    common.active(data, req);

    res.render('personCenter/capitalRecord',data);
});


//安全设置
router.get('/personCenter/securitySetting', function(req, res, next) {

    var data={};
    common.active(data, req);

    res.render('personCenter/securitySetting',data);
});


//查子账户列表
router.post('/childAccount/search',function(req , res , next){
    asyncRequst.singleRequest('/childAccount/search','post',req,res,function(data){
        res.send(data);
    })
});
//查子账户列表
router.post('/childAccount/freeze',function(req , res , next){
    asyncRequst.singleRequest('/childAccount/freeze','post',req,res,function(data){
        res.send(data);
    })
});
//查子账户列表
router.post('/childAccount/delete',function(req , res , next){
    asyncRequst.singleRequest('/childAccount/delete','post',req,res,function(data){
        res.send(data);
    })
});
//添加子账户
router.post('/childAccount/addOrModify',function(req , res , next){
    asyncRequst.singleRequest('/childAccount/addOrModify','post',req,res,function(data){
        res.send(data);
    })
});
//查询省份
router.post('/childAccount/childProvince',function(req , res , next){
    asyncRequst.singleRequest('/childAccount/childProvince','post',req,res,function(data){
        res.send(data);
    })
});
//修改密码
router.post('/supplier/user/modifyPwd',function(req , res , next){
    asyncRequst.singleRequest('/supplier/user/modifyPwd','post',req,res,function(data){
        res.send(data);
    })
});
//查询提现记录
router.post('/supplierCash/searchCash',function(req , res , next){
    asyncRequst.singleRequest('/supplierCash/searchCash','post',req,res,function(data){
        res.send(data);
    })
});
//供应商提现
router.post('/supplierCash/cash',function(req , res , next){
    asyncRequst.singleRequest('/supplierCash/cash','post',req,res,function(data){
        res.send(data);
    })
});
//资金记录
router.post('/supplierCash/searchRecord',function(req , res , next){
    asyncRequst.singleRequest('/supplierCash/searchRecord','post',req,res,function(data){
        res.send(data);
    })
});
module.exports = router;