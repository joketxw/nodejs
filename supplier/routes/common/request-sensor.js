/**
 * Request 封装
 */
var express = require('express');
var request = require('request');
var async = require('async');
var config = require('./config');
/**
 * 单个request请求Java后台
 */
var singleRequest = function (_url, type, req, res, callback) {

    async.parallel({
        fn: function (done) {
            var params = req.body,
                headers = {'Content-Type': 'application/x-www-form-urlencoded'},
                token = req.signedCookies.supplierCookie ? req.signedCookies.supplierCookie.token : '';
            if (type == 'get') {
                params = req.query;
            }
            if (token) {
                headers.access_token = token
            }
            var options = {
                method: type,
                url: config.ip.host + ':' + config.ip.port + _url,
                headers: headers,
                form: params
            };
            request(options, function (err, response, body) {
                done(err, body);
            });
        }
    }, function (error, result) {
        if (!error) {
            var data = JSON.parse(result.fn);
            callback(data);
        } else {
            console.log("error:" + error);
        }
    });
};
/**
 * 单个上传图片，调用的路由方法需要使用multer().any()
 * 例:
 * router.post('/sku/uploadPic',multer().any(),function(req,res){
 *      mart.uploadPic(host+'admin/sku/uploadPic',host+'admin/sku/delPic',req,res);
 * });
 */
var uploadPic = function (uploadUrl, delUrl, req, res, fn) {
    var oldUrl = req.query.oldUrl;
    var headers = "";
    var token = req.signedCookies.adminCookie ? req.signedCookies.adminCookie.token : '';
    var originalname = req.files[0].originalname;
    originalname = originalname.substring(originalname.lastIndexOf('.') + 1);
    headers = {
        suffix: originalname
    };
    if (token) {
        headers.access_token = token;
    }
    async.parallel({
        del: function (done) {
            var data = {oldUrl: oldUrl};
            var options = {
                url: delUrl,
                method: 'POST',
                headers: headers,
                form: data
            };
            request(options, function (err, response, body) {
                if (!err) {
                    done(null, body);
                } else {
                    done(err, null);
                }
            });
        },
        pic: function (done) {
            var options = {
                url: uploadUrl,
                method: 'POST',
                headers: headers,
                body: req.files[0].buffer
            };
            request(options, function (err, response, body) {
                if (!err) {
                    done(null, body);
                } else {
                    done(err, null);
                }
            });
        }
    }, function (error, result) {
        if (!error) {
            res.send(JSON.parse(result.pic));
        } else {
            console.log('错误');
            console.log(error);
        }
    });
};
exports.uploadPic = uploadPic;
exports.singleRequest = singleRequest;

/*exports.fileRequest = fileRequest;*/
