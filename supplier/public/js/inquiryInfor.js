var id='';
var offerId='';

require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {
        common.layDateInit("#quotationAsString",false,function(){});
        common.layDateInit("#enquiryTimeString",false,function(){});
        common.layDateInit("#expirationTimeString",false,function(){});
        common.numSpot(['reduceOfferInput']);
        common.numSpot(['InputText1']);
        var a=$('.InputText3').val();
        var b=$('.InputText4').val();
        searchBargain(1,4,'','','','');
       click();
    }
);

function searchBargain(pageNum,pageSize,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString){
    var imgPath = $("#imgPath").val();
    $.tokenAjax({
        url: '/enquiry/searchBargain',
        type: 'post',
        data: {enquiryCode:enquiryCode,fgoodsName:fgoodsName,enquiryTimeString:enquiryTimeString,expirationTimeString:expirationTimeString,pageNum:pageNum,pageSize:pageSize},
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var hml='';
                var common = require("common");
                var pages = Math.ceil(data.retEntity.totalCount/pageSize);
                //var pages=parseInt(page)+1;
                $(list).each(function (ix, dto) {
                    hml+='<li enquiryCode='+dto.enquiryCode+' offerId='+dto.enquiryOffer.offerId+' id='+dto.enquiryBargain.id+'>';
                    hml+='<div class="blueDiv">';
                    hml+='<span>询价号：'+dto.enquiryCode+'</span>';
                    hml+='<span>询价时间：'+dto.createTime+'</span>';
                    hml+='<span>过期时间：'+dto.expirationTimeString+'</span>';
                    hml+='</div>';
                    hml+='<div class="picBox">';
                    hml+='<div class="topBox">';
                    hml+='<div class="topLeft"></div>';
                    hml+='<div class="topRight"></div>';
                    hml+='</div>';
                    hml+='<img src="'+imgPath+dto.entryGoods.fgoodsImgs+'" class="lisPic">';
                    hml+='</div>';
                    hml+='<div class="textBox">';
                    hml+='<div class="text1">'+dto.entryGoods.fgoodsName+'</div>';
                    hml+='<div class="text2">';
                    hml+=''+dto.goodsBrand.brandName+'';
                    hml+='</div>';
                    hml+='<div class="text2">';
                    hml+=''+dto.searchKey+'';
                    hml+='</div>';
                    hml+= '<ul class="xinHao">';
                    if(dto.productAttrs){
                        var productAttrs=JSON.parse(dto.productAttrs);
                        $(productAttrs).each(function (ix, dto) {
                            hml += '<li>'+dto.title+':'+dto.val+'</li>';
                        });
                    }
                    hml+='</ul>';
                    /*hml+= '<ul class="xinHao">';
                    var productAttrs=JSON.parse(dto.productAttrs);
                    $(productAttrs).each(function (ix, dto) {
                        hml += '<li>'+dto.title+':'+dto.val+'</li>';
                    });
                    hml+='</ul>';*/
                   // hml+='<span class="attributeRight">量程:>100t</span>';
                    hml+='</div>';
                    hml+='</div>';
                    hml+='<div class="textBox1">'+dto.quantity+'</div>';
                    hml+='<div class="textBox2"  id="offer">'+dto.enquiryOffer.offer+'</div>';
                 //   if(dto.isBargain==0){
                    hml+='<div class="textBox2"  id="bargaining">'+dto.enquiryBargain.bargainMoney+'</div>';
                    if(dto.enquiryBargainTwo) {
                        hml += '<div class="textBox2">' + dto.enquiryBargainTwo.twoMoney + '</div>';
                    }else {
                        hml += '<div class="textBox2">--</div>';
                    }
                    if(dto.enquiryBargain.bstatus==0) {

                     hml+='<div class="rightT rightTmg"><div class="agree">[同意议价]</div><div class="refuse">[拒绝议价]</div><div class="reduce">[降低报价]</div></div>';
                    }else if(dto.enquiryBargain.bstatus==1){
                     hml+='<div class="rightT rightTmg">您已同意</div>';
                    }else if(dto.enquiryBargain.bstatus==2){
                     hml+='<div class="rightT rightTmg">您已拒绝</div>';
                    }else if(dto.enquiryBargain.bstatus==3){
                     hml+='<div class="rightT rightTmg">您已降低报价</div>';
                    }
                  //  }else if(dto.isBargain==1){
                  //      hml+='<div class="textBox2">已报价</div>';
                  //      hml+='<div class="rightT rightTmg">[查看报价]</div>';
                  //  }
                    hml+='</li>';
                });
                $(".classList").html(hml);
              //  layer.msg('搜索成功',{time:1000,icon:1});
                 common.layPageInit('layPageBox', pages, pageNum , function(pageNum){
                     searchBargain(pageNum,pageSize,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString);
                 });
            }else if(data.retCode == 1405) {
                var hml='';
                hml+='<div class="doing">没有数据...</div>';
                $(".classList").html(hml);
                var common = require("common");
                common.layPageInit('layPageBox', 0, 0 ,function(pageNum){});
            }else{
                $(".classList").html('请求错误');
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }

            }
        }
    })
}
//报价
function offer(){
    if($("#offer").valid()) {//表单验证
        $.tokenAjax({
            url: '/enquiry/offer',
            type: 'post',
            data: $("#offer").serialize(),
            success: function (data) {
                if (data.retCode == 1555) {
                    layer.msg("报价成功!", {time: 800, icon: 1});
                    $('.offerDiv').hide();
                    searchBargain(1,4,'','','','');
                } else {
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
//报价操作
function bargainManager(flag,offer,id,offerId){
        $.tokenAjax({
            url: '/enquiry/bargainManager',
            type: 'post',
            data:{flag:flag,offer:offer,id:id,offerId:offerId},
            success: function (data) {
                if (data.retCode == 1555) {
                    layer.msg("操作成功!", {time: 800, icon: 1});
                    $('.refuseOffer').hide();
                    $('.agreeOffer').hide();
                    $('.reduceOffer').hide();
                    searchBargain(1,4,'','','','');
                } else {
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
        var enquiryCode=$('.InputText1').val();
        var fgoodsName=$('.InputText2').val();
        var enquiryTimeString=$('.InputText3').val();
        var expirationTimeString=$('.InputText4').val();
        $('.classificationul li').removeClass('active');
        $('.classificationul li:eq(0)').addClass('active');
        searchBargain(1,4,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString);
    });

    $(document).on("click", ".agree", function (){
        var agreeOffer1=$(this).parent().parent().find('#offer').html();
        var agreeOffer2=$(this).parent().parent().find('#bargaining').html();
        var enquiryCode=$(this).parent().parent().attr('enquiryCode');

        $('#agreeOffer1').html(enquiryCode);
        $('#agreeOffer2').html(agreeOffer1);
        $('#agreeOffer3').html(agreeOffer2);

        //offer=agreeOffer1;
        id=$(this).parent().parent().attr('id');
        offerId=$(this).parent().parent().attr('offerId');

        $('.agreeOffer').show().addClass('flipInX animated')
    });

    $(document).on("click", ".Agree1", function (){
        bargainManager(1,0,id,offerId);
    });

    $(document).on("click", ".cancel1", function (){
        $('.agreeOffer').hide();
    });
    $(document).on("click", ".refuse", function (){
        id=$(this).parent().parent().attr('id');
        offerId=$(this).parent().parent().attr('offerId');
        var enquiryCode=$(this).parent().parent().attr('enquiryCode');
        var agreeOffer1=$(this).parent().parent().find('#offer').html();
        $('.refuseOffer1').html(enquiryCode);
        $('.refuseOffer2').html(agreeOffer1);
        $('.refuseOffer').show().addClass('flipInX animated')
    });


    $(document).on("click", ".Agree2", function (){

        bargainManager(2,0,id,offerId);
    });
    $(document).on("click", ".cancel2", function (){
        $('.refuseOffer').hide();
    });
    /* $(document).on("click", ".reduceOffer", function (){
     var enquiryCode=$(this).parent().parent().attr('enquiryCode');
     var agreeOffer1=$(this).parent().parent().find('#offer').html();
     $('.refuseOffer1').html(enquiryCode);
     $('.refuseOffer2').html(agreeOffer1);
     $('.reduceOffer').show().addClass('flipInX animated')
     });*/
    //降低
    $(document).on("click", ".Agree3", function (){
        var offer=$('.reduceOfferInput').val();
        if(offer==''||offer==null){
            layer.msg('请先输入二次报价',{time:1000,icon:4});
        }else {
            bargainManager(3,offer,id,offerId);
        }
    });
    $(document).on("click", ".cancel3", function (){
        $('.reduceOffer').hide();
    });


    $(document).on("click", ".reduce", function (){
        var offer=$(this).parent().parent().find('#offer').html();
        $('.redT').html('￥'+offer);
        id=$(this).parent().parent().attr('id');
        offerId=$(this).parent().parent().attr('offerId');
        $('.reduceOffer').show().addClass('flipInX animated')
    });
};