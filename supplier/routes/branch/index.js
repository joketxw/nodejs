/**
 * Created by win7 on 2016/12/23.
 */
var express = require('express');
var asyncRequst = require("../common/request-sensor");
var router = express.Router();
var common = require("../common/common");
var request = require('request');
var config = require('../common/config');
var async = require('async');

/* GET users listing. */
router.get('/index', function(req, res, next) {

        var data = {};
        var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        var token = req.signedCookies.buySensorCookie ? req.signedCookies.buySensorCookie.access_token : '';
        if (token) {
            headers.access_token = token
        }
        async.parallel({
            searchGoods: function (done) {
                var form = {pageNum:1,pageSize:20,title:'',categoryIdf:'142'};
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
            }
        }, function (error, result) {
            if (!error) {
                data.searchGoods = JSON.parse(result.searchGoods);
                console.log("***222222"+result.searchGoods);
                common.active(data, req);
                res.render('index',data);
            } else {
                console.log("error" + error);
            }
        });
    });





router.post('/supplier/goods/searchGoods',function(req , res , next){
    asyncRequst.singleRequest('/supplier/goods/searchGoods','post',req,res,function(data){
        res.send(data);
    })
});



module.exports = router;