/**
 * Created by win7 on 2016/12/23.
 */
var express = require('express');
var router = express.Router();
var asyncRequst = require("../common/request-sensor");

/* GET users listing. */
router.get('/register', function(req, res, next) {
    res.render('register');
});
//注册
router.post('/supplier/user/register',function(req , res , next){
    asyncRequst.singleRequest('/supplier/user/register','post',req,res,function(data){
        res.send(data);
    })
});



module.exports = router;