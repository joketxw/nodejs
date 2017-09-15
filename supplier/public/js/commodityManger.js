var page=1;
var attrsArr = [];
var pageSize = 15;
require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {


        searchGoods(1,pageSize,'','');//初始化
        //分类翻页
        $(".leftChoose").click(function(){
            if(page<1){
                /* layer.msg("已经是第一页啦!",{time:1000,icon:6})*/
            }else {
                $(".leftChoose").attr("disabled",true);
                page--;
                getCategorySup(page,1);  //1是减 2是加
            }
        });
        $(".rightChoose").click(function(){
            $(".rightChoose").attr("disabled",true);//加页
            page++;
            getCategorySup(page,2);
        });
        //分类翻页完毕

        
        //点击
        $(document).on("click", ".classBox li", function (){
            $(this).parent().find('li').removeClass("activi");
            $(this).addClass("activi");
            $(this).parent().find("i").removeClass("active-blue");
            $(this).find("i").addClass("active-blue")
        });
        //点击根据品牌录入商品
        $(document).on("click", "#GoodsByBrandsBtn", function (){
            searchAllBrand();
            $(".offerDiv").show();
        });
        
        $('.addR').click(function(){
            $('.offerDiv').hide();
        });
        
        $(document).on("click", ".addL", function () {
            var brandIds = '';
            var obj=document.getElementsByName('brandIds');
            for(var i=0; i<obj.length; i++){ 
                if(obj[i].checked) brandIds+=obj[i].value+',';  
            }
            if(brandIds==''){
                layer.msg("请选择品牌!",{time:1000,icon:6});
            }else{
                brandIds = brandIds.substr(0,brandIds.length-1);            
                addChildAccount(brandIds);
            }
        });
        
        //录入商品开始
        $(document).on("click", "#goodsBtn", function (){
            var fgoodsName=$(this).parents('li').attr("fgoodsName");
            var goodsNo=$(this).parents('li').attr("goodsNo");
            var fbrandsId=$(this).parents('li').attr("fbrandsId");
            var productNo=$(this).parents('li').attr("productNo");
            var fgoodsStock=$(this).parents('li').attr("fgoodsStock");
            var fgoodsImgs=$(this).parents('li').find('#fgoodsImgs').html();
            var categoryIdf=$(this).parents('li').attr("categoryIdf");
            var fspec=$(this).parents('li').attr("fspec");
            if(fspec==null||fspec==''){
                layer.msg("请先选中规格!",{time:1000,icon:0})
            }else{
                entryMyGoods(goodsNo,fgoodsName,fbrandsId,fgoodsStock,fgoodsImgs,fspec,productNo,categoryIdf);
            }
        });
        //根据商品全部录入开始
        $(document).on("click", "#goodsAllBtn", function (){
                var goodsNo=$(this).parents('li').attr("goodsNo");
                layer.confirm('是否录入此商品的所有产品?', function(){ 
                entryMyGoodsAll(goodsNo);
            });
        });
        
        $(document).on("click", ".classBox li", function () {
            var spec=$(this).attr("spec");
            var productNo=$(this).attr("productNo");
            $(this).parents('li').attr("fspec",spec);
            $(this).parents('li').attr("productNo",productNo);

            var searchKey=$(this).attr('searchKey');
            var html='';
           // var productAttrs1=JSON.parse(productAttrs);
            //alert(JSON.stringify(attrsArr));
            $(attrsArr).each(function (ix, dto){

                if(dto.searchKey==searchKey){
                    var productAttrs=JSON.parse(dto.productAttrs);

                    $(productAttrs).each(function (ix, dto){
                        html+='<li>'+dto.title+':'+dto.val+'</li>';
                    })
                }
            });
              $(this).parent().parent().find('.xinHao').html(html);
        });
        //录入商品结束

         //分类
        $(document).on("click", ".classificationul li", function () {
            var categoryIdf=$(this).attr("catId");
            $(".classificationul li").removeClass("active");
            $(this).addClass('active');
            searchGoods(1,pageSize,'',categoryIdf);
        });
        //搜索
        $(".searchButton").click(function(){
             var search=$(".searchInput1").val();
             if(search==''||search==null){
                 layer.msg("请输入内容!",{time:800,icon:6})
             }else {
                 searchGoods(1,pageSize,search,'');
             }
        });
    }
);



function searchGoods(currIndex,pageSize,title,categoryIdf){
    var imgPath = $("#imgPath").val();
    $.tokenAjax({
        url: '/supplier/goods/searchGoods',
        type: 'post',
        async: false,//将异步改成同步
        data: {pageNum:currIndex,pageSize:pageSize,title:title,categoryIdf:categoryIdf},
        success: function (data) {
            if (data.retCode == 1901){
                var list=data.retEntity.content;
                var hml='';
                var common = require("common");
                var page = data.retEntity.totalCount/pageSize;
                var pages = Math.ceil(data.retEntity.totalCount/pageSize);
                if(list.length!==0) {
                    $(list).each(function (ix, dto) {
                        hml += '<li id=' + dto.id + ' fgoodsName=' + dto.title + ' goodsNo=' + dto.goodsNo + ' fbrandsId='+dto.brandId+' productNo=0  fgoodsStock='+dto.totalStock+' categoryIdf='+dto.categoryIdf+'  fspec="">';
                        hml += '<div id="fgoodsImgs" class="hide">'+dto.goodsImg+'</div>';
                        hml += '<div class="picBox">';
                        hml += '<div class="topBox">';
                        hml += '<div class="topLeft"></div>';
                        hml += '<div class="topRight"></div>';
                        hml += '</div>';
                        hml += '<img src='+imgPath+dto.goodsImg + ' class="lisPic">';
                        hml += '</div>';
                        hml += '<div class="textBox">';
                        hml += '<div class="text1">' + dto.title + '</div>';
                        hml+= '<div class="text2">' + dto.brandName + '</div>';
                        hml+= '<ul class="xinHao">';

                        hml+='</ul></div>';
                        hml+='<ul class="classBox clearfix">';
                      //  if (dto.productList == '' || dto.productList == null) {

                            /* var specTables= specTables == '' ? '' : jQuery.parseJSON(dto.specTables);*/
                      //  }else{

                           // var productList = jQuery.parseJSON(dto.productList);

                        attrsArr = [];
                        var productList = dto.productList;
                        if (productList) {
                            for (var i = 0; i < productList.length; i++) {
                                var searchKey=productList[i].searchKey;
                                var productAttrs=productList[i].productAttrs;


                                attrsArr.push({
                                    searchKey: searchKey,
                                    productAttrs:productAttrs
                                });
                            }

                        }
                            $(dto.productList).each(function (ix, dto) {
                                if(dto.productAttrs==null||dto.productAttrs==''){

                                }else {
                                    var productAttrs=(dto.productAttrs).toString();
                                }

                                hml+='<li spec='+dto.spec+' searchKey='+dto.searchKey+' productNo='+dto.productNo+'>'+dto.searchKey+'<i class=""></i></li>';
                            });
                      // }
                        hml += '</ul>';
                        hml += '<div class="rightT"><p class="blueBtn" id="goodsBtn">[录入我的商品]</p><p class="blueBtn" id="goodsAllBtn">[按商品全部录入]</p></div>';
                        hml += '</li>';

                    });
                }else {
                        hml+='此项暂无内容';
                }
                $(".classList").html(hml);
                common.layPageInit('layPageBox', pages, currIndex , function(currIndex){
                    searchGoods(currIndex,pageSize,title,categoryIdf);
                });
            }else {
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }
        }
    })
}



function entryMyGoods(goodsNo,fgoodsName,fbrandsId,fgoodsStock,fgoodsImgs,fspec,productNo,categoryIdf){
    $.tokenAjax({
        url: '/supplier/goods/entryMyGoods',
        type: 'post',
        data: {goodsNo:goodsNo,fgoodsName:fgoodsName,fbrandsId:fbrandsId,fgoodsStock:fgoodsStock,fgoodsImgs:fgoodsImgs,fspec:fspec,productNo:productNo,categoryIdf:categoryIdf},
        success: function (data) {
            if (data.retCode == 1555){
                layer.msg("录入成功!",{time:800,icon:1})
            }else {
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }
        }
    })
}

function entryMyGoodsAll(goodsNo){
    $.tokenAjax({
        url: '/supplier/goods/entryMyGoodsAll',
        type: 'post',
        data: {goodsNo:goodsNo},
        success: function (data) {
            if (data.retCode == 200){
                if(data.retEntity.msgCode==200){
                 layer.msg("录入成功!",{time:800,icon:1})
                }else{
                 layer.msg("会话超时!请重新登录", {icon: 5,time:1500})
                }
            }else {
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }
        }
    })
}

function searchAllBrand(){
    $.tokenAjax({
        url: '/supplier/goods/selectAllBrand',
        type: 'post',
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var hml='';
                if(list.length!==0) {
                    $(list).each(function (ix, dto) {
                        hml += '<input type="checkbox" name="brandIds" value="'+dto.id+'" />'+dto.brandName;
                    });
                }else{
                    hml='无数据';
                } 
                $("#brandsDiv").html(hml);
            }else {
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }
        }
    })
}



function getCategorySup(pageNum,type){
    $.tokenAjax({
        url: '/category/getCategorySup',
        type: 'post',
        data: {pageNum:pageNum,pageSize:8},
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var hml='';
                $(list).each(function (ix, dto) {
                    hml+='<li catId='+dto.catId+'>'+dto.catName+'</li>';
                });
                $(".classificationul").html(hml);

                if(type==1){
                    page++;
                }else{
                    page--;
                }
            }else {
                if(type==1){
                    page++;
                }else{
                    page--;
                }

                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }
        }
    })
}
//根据品牌录入商品
function addChildAccount(brandIds){
    if($("#addFm").valid()) {//表单验证
        $.tokenAjax({
            url: '/supplier/goods/entryMyGoodsByBrands',
            type: 'post',
            data: {brandIds:brandIds},
            success: function (data) {
                if (data.retCode == 200) {
                    if(data.retEntity.msgCode==200){
                        layer.msg("添加成功!", {time: 1500, icon: 1},function(){
                           });
                    }else{
                        layer.msg("超时,请重新登录", {icon: 5,time:1500});
                    }
                    $('.offerDiv').hide();
                }else{
                    if(data.retMsg){
                        layer.msg(data.retMsg, {icon: 5,time:1500})
                    }else{
                        layer.msg(data.msgString, {icon: 5,time:1500})
                    }
                    }
                }
        })
    }
}