/**
 * Created by win7 on 2016/12/22.
 */
var express = require('express');
var router = express.Router();
var asyncRequst = require("../common/request-sensor");
var cookie = require("cookie");

/* GET users listing. */
router.get('/login', function(req, res, next) {
    res.render('login');
});
//登录
router.post('/supplier/user/login',function(req , res , next){

    asyncRequst.singleRequest('/supplier/user/login','post',req,res,function(data){

        if(data.retCode == 200) {
            var existMinutes = 600 * 30;
            res.cookie('supplierCookie', data.retEntity, {
                maxAge: existMinutes * 1000,
                signed: true,
                path: '/',
                httpOnly: false
            });
            data.encryptCookie = cookie.parse(res.get('set-cookie'));
            data.encryptCookie.maxAge = existMinutes;
        }
        res.send(data);
    });

});



module.exports = router;