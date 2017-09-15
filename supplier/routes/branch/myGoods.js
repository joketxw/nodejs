var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');

router.get('/myGoods', function(req, res, next) {
    var data = {};
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    var token = req.signedCookies.buySensorCookie ? req.signedCookies.buySensorCookie.token : '';
    if (token) {
        headers.token = token
    }
    async.parallel({
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
            data.getCategorySup = JSON.parse(result.getCategorySup);
            console.log("***222222"+data);
            common.active(data, req);
            res.render('myGoods',data);
        } else {
            console.log("error" + error);
        }
    });
});

//删除
router.post('/supplier/goods/deleteGoods',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/deleteGoods','post',req,res,function(data){
        res.send(data);
    })
});

//删除所有无效商品
router.post('/supplier/goods/deleteAllInvalid',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/deleteAllInvalid','post',req,res,function(data){
        res.send(data);
    })
});

//商品上下架
router.post('/supplier/goods/upOutGoods',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/upOutGoods','post',req,res,function(data){
        res.send(data);
    })
});
//根据分类id获取列表
router.post('/supplier/goods/selectByCatId',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/selectByCatId','post',req,res,function(data){
        res.send(data);
    })
});

//统计总的上下架数量
router.post('/supplier/goods/countNumber',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/countNumber','post',req,res,function(data){
        res.send(data);
    })
});


router.post('/category/getCategorySup',function(req , res , next){
    asyncRequst.singleRequest('/category/getCategorySup','post',req,res,function(data){
        res.send(data);
    })
});


module.exports = router;
