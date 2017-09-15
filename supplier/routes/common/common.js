/**
 * Created by Administrator on 2016/12/7 0007.
 */

var config = require('./config');
var active = function(data,req){

    var data = data || {};
    var originalUrl = req.originalUrl;
    var isLogin = req.signedCookies.supplierCookie ? true : false;
    var header= {nav:1,isLogin:0},
        sideLeft = null,searchBar = null;
    header.isLogin = isLogin;

    if(originalUrl.indexOf('/inquiryList')==0){header.nav = 1}
    if(originalUrl.indexOf('/inquiryInfor')==0){header.nav = 1}
    if(originalUrl.indexOf('/commodityManger')==0){header.nav = 1}
    if(originalUrl.indexOf('/myGoods')==0){header.nav = 1}
    if(originalUrl.indexOf('/orderCenter')==0){header.nav = 1}
    if(originalUrl.indexOf('/monthlyOrder')==0){header.nav = 1}
    if(originalUrl.indexOf('/supplierNews/newsList')==0){header.nav = 3}
    if(originalUrl.indexOf('/personCenter') == 0){
        header.nav = 2;
       /* if(originalUrl == '/personal'){searchBar="个人中心"}
        if(originalUrl.indexOf('/personal/inquiryCar')==0){sideLeft = 0;searchBar="询价车"}
        if(originalUrl == '/personal/orderCenter'){sideLeft = 1;searchBar="订单中心"}
        if(originalUrl == '/personal/orderMonth'){sideLeft = 2;searchBar="月结订单"}
        if(originalUrl == '/personal/orderService'){sideLeft = 3;searchBar="售后订单"}*/
        if(originalUrl == '/personCenter/securitySetting'){sideLeft = 0,header.nav = 2}
        if(originalUrl == '/personCenter/childAccountManagement'){sideLeft = 1,header.nav = 2}
        if(originalUrl == '/personCenter/presentationRecord'){sideLeft = 2}
        if(originalUrl == '/personCenter/capitalRecord'){sideLeft = 3}
    }

    data.active = sideLeft == null ? {header : header} : {header : header,sideLeft : sideLeft};
    data.active.searchBar = searchBar;
    data.imgPath = config.imgPath.host + ':' + config.imgPath.port;
    return data
};
exports.active = active;