/**
 * Created by Neng.Gao on 2016/12/1 0001.
 * description : 公共方法
 */

define(['jquery','laypage'], function($,laypage) {



  //  layer.msg("网站建设中，客官请留步...",{time:1000,icon:1})







    $(function(){
        show();
        $('.iblock li').on("click",function(){

          //  layer.msg("网站建设中，客官请留步...",{time:1500,icon:6})

        });

        var $searchBtn = $(".productSearch");
        var title = getUrlParam("title");
        if(title){$searchBtn.prev().val(title);}
        numEral(['numEral']);
        numSpot(['numSpot']);
        $searchBtn.on("click",function(){
            var title = $(this).prev().val();
            if($("body").attr("id") != 'product' && title != '')
            window.location.href = '/product?title=' + title;
        });
        // 回车模拟点击搜索
        $searchBtn.prev().on('keydown',function(ev){
            if(ev.which == 13){
                $searchBtn.trigger('click');
            }
        });
    });


   /*var qidai=function(){
       layer.msg("还未开放!",{time:1500,icon:4});
    };*/


    // 设置cookie(以day计算的)
    function setCookie(name, value, iDay) {
        if (iDay !== false) {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + iDay);
            document.cookie = name + '=' + value + ';expires=' + oDate + ';path=/';
        } else {
            document.cookie = name + '=' + value;
        }
    }
    // 设置cookie(以minutes计算的)
    function setCookieExistMinutes(name, value, iMinutes) {
        if (iMinutes !== false) {
            var oDate = new Date();
            oDate.setMinutes(oDate.getMinutes() + iMinutes);
            document.cookie = name + '=' + value + ';expires=' + oDate.toGMTString() + ';path=/';
        } else {
            document.cookie = name + '=' + value;
        }
    }
    // 获取cookie
    function getCookie(name) {
        var arr = document.cookie.split('; ');
        var i = 0;
        for (i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return arr2[1];
            }
        }
        return '';
    }
    // 移除cookie
    function removeCookie(name) {
        setCookie(name, '', -1);
    }
    //获取 url 上的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
    //图片预加载
    function preloadimages(arr){
        var newimages=[];
        var arr=(typeof arr!="object")? [arr] : arr ;
        for (var i=0; i<arr.length; i++){
            newimages[i]=new Image();
            newimages[i].src=arr[i]
        }
    }

    //日期控件方法
    function layDateInit(elem,showTime,callback){

        var format = showTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD';
        var options = {
            elem: elem, //需显示日期的元素选择器
            event: 'click', //触发事件
            format: format, //日期格式
            istime: false, //是否开启时间选择
            isclear: true, //是否显示清空
            istoday: true, //是否显示今天
            issure: true,
            festival: true, //是否显示节日
            min: '1900-01-01 00:00:00', //最小日期
            max: '2099-12-31 23:59:59', //最大日期
            fixed: false, //是否固定在可视区域
            zIndex: 99999999, //css z-index
            choose: function(dates){ //选择好日期的回调
                callback(dates);
            }
        };
        $(elem).on("click",function(){laydate(options)})
    }

    //限制只能输入数字
    function numEral(arr) {

        for(var i = 0;i<arr.length;i++){
            var $obj = $("."+arr[i]);
            $obj.keyup(function(){$obj.val($obj.val().replace(/\D|^0/g,''));}).bind("paste",function(){  $obj.val($obj.val().replace(/\D|^0/g,''));}).css("ime-mode", "disabled");
        }
    }
    //限制只能输入数字和小数点
    function numSpot(arr) {
        for(var i = 0;i<arr.length;i++) {
            var $obj = $("." + arr[i]);
            var $val = $obj.val();
            $obj.keyup(function(){
                $(this).val($(this).val().replace(/[^0-9.]/g,''));
            }).bind("paste",function(){
                $(this).val($(this).val().replace(/[^0-9.]/g,''));
            }).css("ime-mode", "disabled");
    /*         $obj.on('input propertychange','.'+arr[i],function(){
             var count = $val.match(/\./g);
             if(count == null) return;
             if(count.length > 1){
             var pos= $val.indexOf('.');
             pos = $val.indexOf('.',pos+1);
             $val=$val.substring(0,pos) + $val.substring(pos+1,$val.length);
             $obj.val($val);
             }
             });*/
        }
    }


    function show(){
            $.tokenAjax({
                url: '/supplierNews/show',
                type: 'post',
                data: {pageNum:1,pageSize:4},
                success: function (data) {
                    if (data.retCode==200) {
                        var list=data.retEntity;
                        $('.carNumber').html(list.list.length);
                    } else {

                    }
                }
            })
    }

    function layPageInit(name,pages,pageIndex,callback){
        laypage({
            cont: name, //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages, //总页数
            skip: false, //是否开启跳页
            skin: '#ea0000',
            groups: 10, //连续显示分页数
            curr: pageIndex || 1, //当前页
            jump: function(obj, first) { //触发分页后的回调
                if(!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                    var currIndex = obj.curr;
                    callback(currIndex);
                }
            }
        });
    }
//将此处封装的方法暴露出去
    return {
        setCookie: setCookie,
        setCookieExistMinutes: setCookieExistMinutes,
        getCookie: getCookie,
        removeCookie: removeCookie,
        getUrlParam : getUrlParam,
        preloadimages : preloadimages,
        layPageInit : layPageInit,
        layDateInit: layDateInit,
        numSpot:numSpot
    }
});

//二次封装ajax请求 拦截 不通过 token 验证的请求
(function($){

    $.tokenAjax = function(json){
        var async = true;
        if(!json.async){async = false}
        $.ajax({
            url: json.url,type: json.type,data: json.data,async:async,

            success: function(data){
                if(data.code == 9999){
                    window.location = "/signIn";
                }else{
                    //next
                    json.success(data);
                }
            },
            error:function(err){
                console.log("err" + err);
            }
        });
    }
})(jQuery);