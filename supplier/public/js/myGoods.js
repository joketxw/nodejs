var page=1;
require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {
       /* getCategorySup(1,10);*/
      /*  common.layPageInit('layPageBox', 10, 1, searchGoods);*/
        var status=1;
        getCategorySup1(1);
        selectByCatId(1,5,'',1,'');

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



        $(document).on("click", ".countNumber", function () {
            var search=$(this).attr("catId");
            $(".classificationul li").removeClass("active");
            $(this).addClass('active');
            /* searchGoods(1,5,'',search);*/
        });

        $(document).on("click", ".rightT", function (){
            var fgoodsName=$(this).parents('li').attr("fgoodsName");

        });

        //搜索
        $(".searchButton").click(function(){
            var search=$(".searchInput").val();
            if(search==''||search==null){
                layer.msg("请输入内容!",{time:800,icon:6})
            }else {
                $(".classificationul li").removeClass("active");
                $(".classificationul").attr("categoryIdf",'');
                $("#all").addClass('active');
                selectByCatId(1,5,'',status,search);
            }
        });

        //上架状态
        $(".upGoods").click(function(){
            var categoryIdf=$(".classificationul").attr("categoryIdf");
            $(".downGoods").removeClass('active');
            $(".invalidGoods").removeClass('active');
            $(".upGoods").addClass('active');
            $(".subMangerTopR").hide();
            status=1;
            selectByCatId(1,5,categoryIdf,status,'');
        });
        //下架状态
        $(".downGoods").click(function(){
            $(".downGoods").addClass('active');
            $(".upGoods").removeClass('active');
            $(".invalidGoods").removeClass('active');
            $(".subMangerTopR").hide();
            var categoryIdf=$(".classificationul").attr("categoryIdf");
            status=0;
            selectByCatId(1,5,categoryIdf,status,'');
        });
        //无效状态
        $(".invalidGoods").click(function(){
            $(".invalidGoods").addClass('active');
            $(".downGoods").removeClass('active');
            $(".upGoods").removeClass('active');
            $(".subMangerTopR").show();
            var categoryIdf=$(".classificationul").attr("categoryIdf");
            status=2;
            selectByCatId(1,5,categoryIdf,status,'');
        });
        //下架
        $(document).on("click", "#xia", function (){
            var fid=$(this).parents('li').attr("fid");
            var status=$(this).parents('li').attr("status");
            upOutGoods(fid,0,status)
        });

        //上架
        $(document).on("click", "#sang", function (){
            var fid=$(this).parents('li').attr("fid");
            var status=$(this).parents('li').attr("status");
            upOutGoods(fid,1,status)
        });

        //删除
        $(document).on("click", "#yi", function (){
            var fid=$(this).parents('li').attr("fid");
            var type=$(this).parents('li').attr("status");
            deleteGoods(fid,type);
        });
        //移除所有无效商品
        $(document).on("click", "#removeInvalid", function (){
            deleteAllInvalid();
        });
        $(document).on("click", ".classificationul li", function () {
            var categoryIdf=$(this).attr("catId");
            $(".classificationul li").removeClass("active");
            $(".classificationul").attr("categoryIdf",categoryIdf);
            $(this).addClass('active');
            selectByCatId(1,5,categoryIdf,status,'')
        });


        /*$(document).on("click", ".classificationul li", function () {
            var search=$(this).attr("catId");
            $(".classificationul li").removeClass("active");
            $(this).addClass('active');
            selectByCatId(1,5,categoryIdf,status,nameOrBrand)
        });*/
    }
);

function selectByCatId(pageNum,pageSize,categoryIdf,status,nameOrBrand){
    var imgPath = $("#imgPath").val();
    $.tokenAjax({
        url: '/supplier/goods/selectByCatId',
        type: 'post',
        data: {pageNum:pageNum,pageSize:pageSize,categoryIdf:categoryIdf,status:status,nameOrBrand:nameOrBrand},
        success: function (data) {
            if (data.retCode == 1901){
                $('.upGoods').val('上架商品 ('+data.retEntity.upCount+')');
            	$('.downGoods').val('下架商品 ('+data.retEntity.downCount+')');
                $('.invalidGoods').val('无效商品 ('+data.retEntity.invalidCount+')');
                var list=data.retEntity.content;
                var hml='';
                var common = require("common");
                var page = data.retEntity.count/pageSize;
                var pages = Math.ceil(data.retEntity.count/pageSize);
                if(list.length!==0){
                $(list).each(function (ix, dto) {
                    hml+='<li  status='+dto.status+'  fid='+dto.fid+' fgoodsName='+dto.title+' goodsNo='+dto.goodsNo+' fbrandsId='+dto.brandId+' productNo='+dto.productId+' fgoodsStock='+dto.totalStock+' fgoodsImgs='+dto.goodsImg+' categoryIdf='+dto.categoryIdf+' fspec="">';
                    hml+='<div class="picBox">';
                    hml+='<div class="topBox">';
                    hml+='<div class="topLeft"></div>';
                    hml+='<div class="topRight"></div>';
                    hml+='</div>';
                    hml+='<img src='+imgPath+dto.fgoodsImgs+' class="lisPic">';
                    hml+='</div>';
                    hml+='<div class="textBox">';
                    hml+='<div class="text1">'+dto.fgoodsName+'</div>';
                    hml+='<div class="text2">'+dto.brandName+'</div>';
                    hml+= '<ul class="xinHao">';

                    var productAttrs=JSON.parse(dto.productAttrs);

                    $(productAttrs).each(function (ix, dto) {
                        hml += '<li>'+dto.title+':'+dto.val+'</li>';
                    });

                    hml+='</ul>';
                    hml+='</div>';
                    hml+='<ul class="classBox clearfix">';
                   /* if(dto.fspec==''||dto.fspec==null){
                        /!* var specTables= specTables == '' ? '' : jQuery.parseJSON(dto.specTables);*!/
                    }else{
                        var fspec= fspec == '' ? '' : jQuery.parseJSON(dto.fspec);
                        $(fspec).each(function (ix, dto) {
                            hml+='<li spec='+dto.spec+'>'+dto.spec+'<i class=""></i></li>';
                        });
                    }*/
                    hml+='<li fspec='+dto.fspec+'>'+dto.searchKey+'<i class=""></i></li>';

                    hml+='</ul>';
                    if(status==0){
                        hml+='<div class="rightT"><p id="sang">[上架]</p><p id="yi">[移除]</p></div>';
                    }else if(status==1){
                        hml+='<div class="rightT"><p id="xia">[下架]<p></div>';
                    }else{
                        hml+='<div class="rightT"><p id="yi">[移除]</p><p class="invalidMsg">无效商品请移除,并重新添加有效商品</p></div>';
                    }
                    hml+='</li>';
                });
                }else {
                    hml+='此项暂无内容';
                }
                $(".classList").html(hml);
                common.layPageInit('layPageBox', pages, pageNum , function(pageNum){
                    selectByCatId(pageNum,pageSize,categoryIdf,status,nameOrBrand);
                });
            }else {
                $(".classList").html('请求错误');
                var common = require("common");
                common.layPageInit('layPageBox', 0, 0 ,function(pageNum){

                });
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }
        }
    })
}


//删除商品
function deleteGoods(fid,type){
    $.tokenAjax({
        url: '/supplier/goods/deleteGoods',
        type: 'post',
        data: {fid:fid},
        success: function (data) {
            if (data.retCode == 1901){
                layer.msg("删除成功!",{time:800,icon:1});
                var categoryIdf=$(".classificationul").attr("categoryIdf");
                if(categoryIdf){
                    selectByCatId(1,5,categoryIdf,type,'');
                }else {
                    selectByCatId(1,5,categoryIdf,type,'');
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
//移除所有无效商品
function deleteAllInvalid(){
    $.tokenAjax({
        url: '/supplier/goods/deleteAllInvalid',
        type: 'post',
        success: function (data) {
            if (data.retCode == 200){
            	if(data.retEntity.msgCode == 200){
                layer.msg("移除成功!",{time:800,icon:1});
                var categoryIdf=$(".classificationul").attr("categoryIdf");
                selectByCatId(1,5,categoryIdf,2,'');
            	}else{
            		layer.msg('会话超时!', {icon: 5,time:1500})
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

//上下架操作
function upOutGoods(fid,status,type){
    $.tokenAjax({
        url: '/supplier/goods/upOutGoods',
        type: 'post',
        data: {fid:fid,status:status},
        success: function (data) {
            if (data.retCode == 1901){
                layer.msg("操作成功!",{time:800,icon:1});
                var categoryIdf=$(".classificationul").attr("categoryIdf");
                if(categoryIdf){
                    selectByCatId(1,5,categoryIdf,type,'');
                }else {
                    selectByCatId(1,5,categoryIdf,type,'');
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

function getCategorySup(pageNum,type){
    $.tokenAjax({
        url: '/category/getCategorySup',
        type: 'post',
        async: false,//将异步改成同步
        data: {pageNum:pageNum,pageSize:8},
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var hml='';
                hml+='<li catId="" id="all" class="active">全部</li>';
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

function getCategorySup1(pageNum){
    $.tokenAjax({
        url: '/category/getCategorySup',
        type: 'post',
        async: false,//将异步改成同步
        data: {pageNum:pageNum,pageSize:8},
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var hml='';
                hml+='<li catId="" id="all" class="active">全部</li>';
                $(list).each(function (ix, dto) {
                    hml+='<li catId='+dto.catId+'>'+dto.catName+'</li>';
                });
                $(".classificationul").html(hml);

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
