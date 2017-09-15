var page=1;
require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {
        /* getCategorySup(1,10);*/
        /*  common.layPageInit('layPageBox', 10, 1, searchGoods);*/
        common.numSpot(['InputText1']);
        common.numSpot(['offerInput']);

        $('#offer').validate({
            rules:{
                deliveryTime:{ required: true, minlength: 1, maxlength: 8},
                quota:{ required: true, minlength: 1, maxlength: 8},
                offer:{ required: true,minlength: 1, maxlength: 8},
                quotationAsString:{required:true}
            },
            messages:{
                deliveryTime:{required: '货期不能为空',minlength: '密码长度不能少于1个字符',maxlength: '密码长度不能超过8个字符'},
                quota:{required: '起定量不能为空',minlength: '起定量不能少于1个字符',maxlength: '起定量不能超过8个字符'},
                offer:{required: '单价不能为空',minlength: '单价不能少于2个字符',maxlength: '单价不能超过8个字符'},
                quotationAsString:{required: '截止日期不能为空'},
            }
        });
        $('.classificationul li:eq(0)').addClass('active');

        common.layDateInit("#quotationAsString",false,function(){});
        common.layDateInit("#enquiryTimeString",false,function(){});
        common.layDateInit("#expirationTimeString",false,function(){});
        searchSupplierEnquirySheet(1,4,'','','','','','');


        $('.searchButton').click(function(){
           var enquiryCode=$('.InputText1').val();
           var fgoodsName=$('.InputText2').val();
           var enquiryTimeString=$('.InputText3').val();
           var expirationTimeString=$('.InputText4').val();
           $('.classificationul li').removeClass('active');
           $('.classificationul li:eq(0)').addClass('active');
           searchSupplierEnquirySheet(1,4,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString,'','');

        });

        $('.classificationul li').click(function(){
//点击分类时也带上搜索框条件
            var enquiryCode=$('.InputText1').val();
            var fgoodsName=$('.InputText2').val();
            var enquiryTimeString=$('.InputText3').val();
            var expirationTimeString=$('.InputText4').val();


            $('.classificationul li').removeClass('active');
            $(this).addClass('active');
            var id=$(this).attr('id');
            if(id==1){
                searchSupplierEnquirySheet(1,4,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString,'','');
              // searchSupplierEnquirySheet(1,4,'','','','','','');
            }else if(id==2){
                searchSupplierEnquirySheet(1,4,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString,0,1);
               //searchSupplierEnquirySheet(1,4,'','','','',0,1);
            }else if(id==3){
                searchSupplierEnquirySheet(1,4,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString,1,1);
               //searchSupplierEnquirySheet(1,4,'','','','',1,1);
            }else if(id==4){
               searchSupplierEnquirySheet(1,4,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString,'',-1);
              // searchSupplierEnquirySheet(1,4,'','','','','',-1);
            }
        });
        $('.lookOfferButton').click(function(){
            $('.lookOffer').hide();
        });

        $('.offerButton2').click(function(){
            //$('.offerDiv').removeClass('flipInX').addClass('flipInX1');
            $('.offerDiv').addClass('bounceInDown animated').hide()
        });
        $(document).on("click", ".offerButton1", function () {

            offer();
        });

        $(document).on("click", ".rightT", function () {

            if($(this).html()=='[报价]'){
                var enquiryCode=$(this).parent().attr('enquiryCode');
                $('#enquiryId').val(enquiryCode);
                $('.offerDiv').show().addClass('bounceInDown animated');
            }else if($(this).html()=='[查看报价]'){

                var targetDelivery=$(this).attr('targetDelivery');
                var expirationTimeString=$(this).parent().find('.expirationTimeString').html();
                var remark=$(this).parent().find('.remark').html();
                var quota=$(this).attr('quota');
                var offer=$(this).attr('offer');
                $('.targetDelivery').html(targetDelivery);
                $('.expirationTimeString').html(expirationTimeString);
                $('.quota').html(quota);
                $('.offer').html(offer);
                $('.remark').html(remark);
                $('.lookOffer').show().addClass('flipInX animated');
            }
        });

       // deliveryTime
       // quota
       // offer1
       // quotationAsString
        /*$(document).on("click", ".classificationul li", function () {
         var search=$(this).attr("catId");
         $(".classificationul li").removeClass("active");
         $(this).addClass('active');
         selectByCatId(1,5,categoryIdf,status,nameOrBrand)
         });*/
    }
);

function searchSupplierEnquirySheet(pageNum,pageSize,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString,isBargain,flag){
    var imgPath = $("#imgPath").val();
    $.tokenAjax({
        url: '/enquiry/searchSupplierEnquirySheet',
        type: 'post',
        data: {pageNum:pageNum,pageSize:pageSize,enquiryCode:enquiryCode,fgoodsName:fgoodsName,enquiryTimeString:enquiryTimeString,expirationTimeString:expirationTimeString,isBargain:isBargain,flag:flag},
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var pages = Math.ceil(data.retEntity.totalCount/pageSize);

                var hml='';
                var common = require("common");
                    $(list).each(function (ix, dto) {
                        hml+='<li enquiryCode='+dto.enquiryCode+'>';
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

                        hml+='</div>';
                        hml+='</div>';
                        hml+='<div class="textBox1">'+dto.targetDelivery+'</div>';
                        hml+='<div class="textBox2">'+dto.quantity+'</div>';
                        if(dto.enquiryOffer){
                            hml+='<div class="textBox2">已报价</div>';
                            hml+='<div class="rightT rightTmg" targetDelivery='+dto.targetDelivery+'  quota='+dto.enquiryOffer.quota+'  offer='+dto.enquiryOffer.offer+'>[查看报价]</div>';
                            hml+='<div class="expirationTimeString hide">'+dto.expirationTimeString+'</div>';
                            hml+='<div class="remark hide">'+dto.enquiryOffer.remark+'</div>';
                        }else{
                            hml+='<div class="textBox2">未报价</div>';
                            hml+='<div class="rightT rightTmg">[报价]</div>';
                        }
                        hml+='</li>';
                    });
                    $(".classList").html(hml);

                common.layPageInit('layPageBox', pages, pageNum ,function(pageNum){
                    searchSupplierEnquirySheet(pageNum,pageSize,enquiryCode,fgoodsName,enquiryTimeString,expirationTimeString,isBargain,flag);
                });
                 //   layer.msg('获取列表成功',{time:1000,icon:1});
               // common.layPageInit('layPageBox', pages, pageNum , function(pageNum){
               //     selectByCatId(pageNum,pageSize,categoryIdf,status,nameOrBrand);
               // });
            }else if(data.retCode == 1405) {
                var hml='';
                hml+='<div class="doing">没有数据...</div>';
                $(".classList").html(hml);
                var common = require("common");
                common.layPageInit('layPageBox', 0, 0 ,function(pageNum){

                });
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
                    layer.msg("报价成功!", {time: 1500, icon: 1},function(){
                        searchSupplierEnquirySheet(1,10,'','','','','','');
                    });
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



