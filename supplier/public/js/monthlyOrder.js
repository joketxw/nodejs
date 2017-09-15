require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common,sideRight) {
        pageList(1,10,'',3,'','','');
        click();
        common.numSpot(['danHao']);
        $('#faDiv').validate({
            rules:{
                flogisticsOrder:{ required: true, minlength: 4, maxlength: 20},
                flogisticsCompany:{ required: true, minlength: 2, maxlength: 8}
            },
            messages:{
                flogisticsOrder:{required: '物流单号不能为空',minlength: '物流单号长度不能少于4个字符',maxlength: '物流单号长度不能超过20个字符'},
                flogisticsCompany:{required: '物流公司不能为空',minlength: '物流公司不能少于2个字符',maxlength: '物流公司不能超过8个字符'},
            }
        });
    }
);

function updateOrder(fid,flogisticsOrder,flogisticsCompany){
    if($("#faDiv").valid()) {//表单验证
        $.tokenAjax({
            url: '/supplierOrder/updateOrder',
            type: 'post',
            data: $("#faDiv").serialize(),
            success: function (data) {
                if (data.retCode == 1556) {
                    layer.msg('发货成功', {icon: 1, time: 1500});
                    pageList(1, 10, '', 3, '', '', '');
                    $('.offerDiv').hide();
                } else {

                    if (data.retMsg) {
                        layer.msg(data.retMsg, {icon: 5, time: 1500})
                    } else {
                        layer.msg(data.msgString, {icon: 5, time: 1500})
                    }
                }
            }
        })
    }
}


function pageList(pageNum,pageSize,fpayStatus,fmoneyStatus,forderStatus,changeStatus,enquiryCode){
    var imgPath = $("#imgPath").val();
    $.tokenAjax({
        url: '/supplierOrder/monthPageList',
        type: 'post',
        data: {pageNum:pageNum,pageSize:pageSize,fpayStatus:fpayStatus,fmoneyStatus:fmoneyStatus,forderStatus:forderStatus,changeStatus:changeStatus,enquiryCode:enquiryCode},
        success: function (data) {
            if (data.retCode == 200){
                var typeCount=data.retEntity.typeCount.split(",");
                var $classificationul=$(".classificationul li");
                for (var i=1;i<$classificationul.length;i++){
                    $classificationul.eq(i).find("em").html('('+typeCount[i-1]+')');
                }
                var list=data.retEntity.list;
                var hml='';
                var common = require("common");
                var page = data.retEntity.totalCount/pageSize;
                var pages = Math.ceil(data.retEntity.totalCount/pageSize);
                if(list.length!==0){
                    $(list).each(function (ix, dto) {
                        hml+='<li>';
                        hml+='<div class="blueDiv">';
                        hml+='<span>订单号：'+dto.forderNo+'</span>';
                        hml+='<span>下单时间：'+dto.forderTime+'</span>';
                        hml+='</div>';
                        hml+='<div class="picBox">';
                        hml+='<div class="topBox">';
                        hml+='<div class="topLeft"></div>';
                        hml+='<div class="topRight"></div>';
                        hml+='</div>';
                        if(dto.supplierOrderGoods){
                            hml+='<img src="'+imgPath+dto.supplierOrderGoods.imgUrl+'" class="lisPic">';
                        }else {
                            hml+='<img src="" class="lisPic">';
                        }

                        hml+='</div>';
                        hml+='<div class="textBox">';
                        if(dto.supplierOrderGoods){
                            hml+='<div class="text1">'+dto.supplierOrderGoods.title+'</div>';
                        }else {
                            hml+='<div class="text1">没有这个字段</div>';
                        }

                        if(dto.goodsBrand){
                            hml+='<div class="text2">'+dto.goodsBrand.brandName+'</div>';
                        }else {
                            hml+='<div class="text2">没有这个字段</div>';
                        }
                        if(dto.supplierOrderGoods) {
                            hml += '<div class="text2">'+dto.supplierOrderGoods.searchKey+'</div>';
                        }
                        hml+= '<ul class="xinHao">';

                        if(dto.supplierOrderGoods){
                            var spec=JSON.parse(dto.supplierOrderGoods.spec);
                            $(spec).each(function (ix, dto) {
                                hml += '<li>'+dto.title+':'+dto.val+'</li>';
                            });
                        }else {
                            hml += '<li>没有这个字段</li>';
                        }

                        hml+='</ul>';
                        hml+='</div>';

                        if(dto.supplierOrderGoods){
                            hml+='<div class="unitPrice">'+dto.supplierOrderGoods.sellPrice+'</div>';
                            hml+='<div class="number">'+dto.supplierOrderGoods.goodsQuy+'</div>';
                        }else {
                            hml+='<div class="unitPrice">没有这个字段</div>';
                            hml+='<div class="number">没有这个字段</div>';
                        }

                        hml+='<div class="Price"><p>'+dto.ftotalPrice+'</p><p>预付:'+dto.falreadyMoney+'</p><p>待付:'+dto.fwaitMoney+'</p></div>';
                        if(dto.fmoneyStatus==1){
                            hml+='<div class="payType">全额支付</div>';
                        }else if(dto.fmoneyStatus==2){
                            hml+='<div class="payType">%30预付款</div>';
                        }else if(dto.fmoneyStatus==3){
                            hml+='<div class="payType">月结支付</div>';
                        }else if(dto.fmoneyStatus==4){
                            hml+='<div class="payType">100%款到发货</div>';
                        }

                        hml+='<div class="state">';

                        if(dto.fpayStatus==0){
                            hml+='<p>未支付</p>';
                        }else if(dto.fpayStatus==1){
                            hml+='<p>已预付</p>';
                        }else if(dto.fpayStatus==2){
                            hml+='<p>已支付</p>';
                        }else if(dto.fpayStatus==3){
                            hml+='<p>退款中</p>';
                        }

                        if(dto.forderStatus==0){
                            hml+='<p>待发货</p>';
                        }else if(dto.forderStatus==1){
                            hml+='<p>待确认收货</p>';
                        }else if(dto.forderStatus==2&&(dto.fpayStatus!==2)){
                            hml+='<p>已收货</p>';
                        }else if(dto.forderStatus==2&&dto.fpayStatus==2){
                            hml+='<p>已完成</p>';
                        }

                        hml+='</div>';

                        if (dto.forderStatus==0&&dto.fmoneyStatus==3){
                            hml+='<div class="btnBox"><input type="button" value="发货" class="faHuo" fid='+dto.fid+' flogisticsOrder="'+dto.flogisticsOrder+'"  flogisticsCompany="'+dto.flogisticsCompany+'"><input type="button" value="查看发货地址" class="seeFa"><div class="hide fdeliveryAddr" >'+dto.fdeliveryAddr+'</div><div class="hide fdeliveryMobile" >'+dto.fdeliveryMobile+'</div><div class="hide fdeliveryName" >'+dto.fdeliveryName+'</div><div class="hide fpostNo" >'+dto.fpostNo+'</div></div>';
                        }
                        hml+='</li>';

                    });
                }else {
                    hml+='此项暂无内容';
                }
                if(status==0){
                    $('.downGoods').val('下架商品 ('+data.retEntity.count+')');
                    $('.upGoods').val('上架商品 ('+data.retEntity.otherCount+')');
                }else{
                    $('.downGoods').val('下架商品 ('+data.retEntity.otherCount+')');
                    $('.upGoods').val('上架商品 ('+data.retEntity.count+')');
                }
                $(".classList").html(hml);
                common.layPageInit('layPageBox', pages, pageNum , function(pageNum){
                    pageList(pageNum,pageSize,fpayStatus,fmoneyStatus,forderStatus,changeStatus,enquiryCode);
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

var click=function(){
    $('.searchButton').click(function(){
        var searchInput=$('.searchInput').val();

        if(searchInput==''||searchInput==null){
            layer.msg('请输入询价编号', {icon: 4,time:1500})
        }else {
            pageList(1,10,'',3,'','',searchInput);
        }
    });

    $('.lookOfferButton').click(function(){
        $('.seeAddress').hide();
    });

    $(document).on("click", ".seeFa", function (){
        var fdeliveryAddr=$(this).next('.fdeliveryAddr').html();
        var fdeliveryMobile= $(this).parent().find('.fdeliveryMobile').html();
        var fdeliveryName= $(this).parent().find('.fdeliveryName').html();
        var fpostNo= $(this).parent().find('.fpostNo').html();
        $('.kol1').html('收回地址:'+fdeliveryAddr);
        $('.kol2').html('电话号码:'+fdeliveryMobile);
        $('.kol3').html('姓名:'+fdeliveryName);
        $('.kol4').html('邮编:'+fpostNo);
        $('.seeAddress').show().addClass('flipInX animated');

    });


   /* $('.payTypeBox li').click(function(){
        var fmoneyStatus=$(this).attr('fmoneyStatus');
        $('.payTypeBox li').removeClass('active');
        $(this).addClass('active');
        $('.classificationul li').removeClass('active');
        pageList(1,10,'',fmoneyStatus,'','','');
    });*/
    $('.classificationul li').click(function(){
        $(".classificationul li").removeClass("active");
        $(this).addClass('active');
        $('.payTypeBox li').removeClass('active');
    });

    $('.col1').click(function(){
        pageList(1,10,'',3,'','','')
    });


    $('.col2').click(function(){
        pageList(1,10,3,3,'','','')
    });

    $('.col3').click(function(){
        pageList(1,10,0,3,1,'','')
    });

    $('.col4').click(function(){
        pageList(1,10,0,3,2,'','')
    });

    $('.col5').click(function(){
        pageList(1,10,2,3,2,'','')
    });
    //发货
    $('.offerButton1').click(function(){
        var fid=$(this).attr('fid');
        $('#fid').val(fid);
        updateOrder();
    });
    $('.offerButton2').click(function(){
        $('.offerDiv').hide();
    });


    $(document).on("click", ".faHuo", function (){
        //    var flogisticsOrder=$(this).attr('flogisticsOrder');
        //   var flogisticsCompany=$(this).attr('flogisticsCompany');
        var fid=$(this).attr('fid');

        $('.offerButton1').attr('fid',fid);
        $('.offerDiv').show().addClass('flipInX animated');
        /*  layer.confirm('您确定要发货吗？', {
         icon:3,
         btn: ['是','否']
         }, function(){
         updateOrder(fid,flogisticsOrder,flogisticsCompany)
         });*/
    });
};