//总路由
var express = require('express');
var router = express.Router();
var app = express();
var login = require('./branch/login');
var register = require('./branch/register');
var index = require('./branch/index');
var commodityManger = require('./branch/commodityManger');
var myGoods=require('./branch/myGoods');
var inquiryInfor=require('./branch/inquiryInfor');
var inquiryList=require('./branch/inquiryList');
var orderCenter=require('./branch/orderCenter');
var personCenter=require('./branch/personCenter');
var supplierNews=require('./branch/supplierNews');
/**
 * 总路由
 * @param {Object} app
 */
module.exports = function(app){

	/***************   拦截IE9的以下浏览器的时候直接跳转浏览器升级用户页面 start *************/
	app.use(function(req,res,next){
		var userAgent = req.headers['user-agent'];

		var IE6 = userAgent.search(/MSIE 6/) != -1;
		var IE7 = userAgent.search(/MSIE 7/) != -1;
		var IE8 = userAgent.search(/MSIE 8/) != -1;
		// 否则重定向到低版本浏览器升级的页面，提供四个主流浏览器，并且有好温馨提示用户下载更新
		if(IE6 || IE7 || IE8){
			res.render('updateBrowser');
		}else{
			next();
		}
	});
	/*/!*****************   拦截IE9的以下浏览器的时候直接跳转浏览器升级用户页面 end *************!/*/

	/*/!***************   前端验证 cookie  start *************!/*/
	 app.use(function(req, res, next) {

 	     var originalUrl = req.originalUrl;
         //跳过静态资源
         var jsPattern = /.(js|css|html|png|jpg|ico|gif)$/;
         if (jsPattern.test(originalUrl)) {
             next();
             return;
         }
		 if(originalUrl == '/'){
			 res.redirect('/login');
		 }
         // get请求 跳过的验证
         if(originalUrl == '/login' ||originalUrl == '/register' || originalUrl == '/forget') {
     			next();
    			return;
		 }
         // post请求 跳过的验证
         if(originalUrl.indexOf('/supplier/user/login') == 0){
     			next();
    			return;
     	 }
		 if(originalUrl.indexOf('/supplier') == 0){
			 next();
			 return;
		 }
         //拦截验证
         if (req.signedCookies.supplierCookie) {
             //获取cookie内容
             var supplierCookie = req.signedCookies.supplierCookie;
             //cookie验证通过next
             if (supplierCookie !== undefined) {
                 next();
                 return;
             }
         } else {
         	if(req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest'){
         		//此 9999 为 token 验证失败后返回到客户端的 code 值 当客户端 ajax 接收到此 code 值时应跳转至 登录页面
         		res.send({code:9999});
         	}else{
         		res.redirect('/login');
         	}
         }

	 /*/!***************   前端验证 cookie  end *************!/*/
 	   });
	app.use(personCenter);
	app.use(inquiryList);
	app.use(inquiryInfor);
	app.use(myGoods);
	app.use(commodityManger);
	app.use(index);
	app.use(login);
	app.use(register);
	app.use(orderCenter);
	app.use(supplierNews);
};