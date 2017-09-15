
var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');


router.get('/commodityManger', function(req, res, next) {
    var data = {};
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    var token = req.signedCookies.supplierCookie ? req.signedCookies.supplierCookie.token : '';
    if (token) {
        headers.access_token = token
    }
    async.parallel({
        searchGoods: function (done) {
            var form = {pageNum:1,pageSize:5,title:'',categoryIdf:''};
            var options = {
                method: 'POST',
                url: config.ip.host +':'+ config.ip.port + '/supplier/goods/searchGoods',
                headers: headers,
                form: form
            };
            request(options, function (err, response, body) {
                if (!err) {
                    done(null, body)
                } else {
                    done(err, null)
                }
            });
        },
        getCategorySup: function (done) {
            var form = {pageNum:1,pageSize:20};
            var options = {
                method: 'POST',
                url: config.ip.host +':'+ config.ip.port + '/category/getCategorySup',
                headers: headers,
                form: form
            };
            request(options, function (err, response, body) {
                if (!err) {
                    done(null, body)
                } else {
                    done(err, null)
                }
            });
        }
    }, function (error, result) {
        if (!error) {
            data.searchGoods = JSON.parse(result.searchGoods);
            data.getCategorySup = JSON.parse(result.getCategorySup);
            console.log("***222222"+result.searchGoods);
            common.active(data, req);
            res.render('commodityManger',data);
        } else {
            console.log("error" + error);
        }
    });
});

//报价
router.post('/enquiry/offer',function(req , res , next){
    asyncRequst.singleRequest('/enquiry/offer','post',req,res,function(data){
        res.send(data);
    })
});

//录入商品
router.post('/supplier/goods/entryMyGoods',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/entryMyGoods','post',req,res,function(data){
        res.send(data);
    })
});

//根据商品全部录入
router.post('/supplier/goods/entryMyGoodsAll',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/entryMyGoodsAll','post',req,res,function(data){
        res.send(data);
    })
});

//根据品牌全部录入
router.post('/supplier/goods/entryMyGoodsByBrands',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/entryMyGoodsByBrands','post',req,res,function(data){
        res.send(data);
    })
});

//查询所有品牌
router.post('/supplier/goods/selectAllBrand',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/selectAllBrand','post',req,res,function(data){
        res.send(data);
    })
});

router.post('/category/getCategorySup',function(req , res , next){
    asyncRequst.singleRequest('/category/getCategorySup','post',req,res,function(data){
        res.send(data);
    })
});

router.post('/supplier/goods/searchGoods',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/searchGoods','post',req,res,function(data){
        res.send(data);
    })
});



module.exports = router;