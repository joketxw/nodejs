require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {
    searchCash(1,5);
    $('#addFm').validate({
            rules:{
                money:{ required: true,number: true,min:0},
                bankName:{ required: true},
                bankUserName:{ required: true},
                bankNo:{ required: true},
            },
            messages:{
                money:{required: '提现金额不能为空',number: '请输入合法的数字',min:'提现金额错误'},
                bankName:{required: '提现方式不能为空'},
                bankUserName:{required: '提现人全名不能为空'},
                bankNo:{required: '收款账号不能为空'},
            }
       });
       $(document).on("click", "#addChildBtn", function (){
            $('.offerDiv').show();
    	});
   	   $('.addR').click(function(){
            $('.offerDiv').hide();
        });
       $(document).on("click", ".addL", function () {
        addCash();
        });
    }
);

function searchCash(pageNum,pageSize){
    $.tokenAjax({
        url: '/supplierCash/searchCash',
        type: 'post',
        data: {pageNum:pageNum,pageSize:pageSize},
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var pages = Math.ceil(data.retEntity.totalCount/pageSize);
                var hml='';
                var common = require("common");
                    $(list).each(function (ix, dto) {
                        hml+='<li>';
                        hml+='<div class="wth20">'+dto.applyName+'</div>';
                        hml+='<div class="wth21">'+dto.bankName+'</div>';
                        hml+='<div class="wth20">'+dto.bankUserName+'</div>';
                        hml+='<div class="wth20">'+dto.bankNo+'</div>';
                        hml+='<div class="wth20">'+dto.money+'</div>';
                        if(dto.state==0){
                        hml+='<div class="wth20">待核审</div>';
                        }else if(dto.state==1){
                        hml+='<div class="wth20"><span class="stateWc">提现完成</span></div>';
                        }else if(dto.state==2){
                        hml+='<div class="wth20"><span class="stateJj">拒绝提现</span></div>';
                        }else{
                        hml+='<div class="wth20"> </div>';
                        }
                        if(dto.content!=null&&dto.content!=''){
                        hml+='<div class="wth20">'+dto.content+'</div>';
                        }else{
                        hml+='<div class="wth20">&nbsp;</div>';
                        }
                        if(dto.reviewTradeNo!=null&&dto.reviewTradeNo!=''){
                        hml+='<div class="wth20">'+dto.reviewTradeNo+'</div>';
                        }else{
                        hml+='<div class="wth20">&nbsp;</div>';
                        }
                        hml+='<div class="wth22">'+dto.addTime+'</div>';
                        hml+='</li>';
                    });
                    $(".subMangerUl").html(hml);
                    common.layPageInit('layPageBox', pages, pageNum ,function(pageNum){
                        searchCash(pageNum,pageSize);
                    });
            }else if(data.retCode == 1405) {
                var hml='';
                hml+='<div class="doing">没有数据...</div>';
                $(".subMangerUl").html(hml);
            }else{
                    $(".subMangerUl").html('请求错误');
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }


        }
    })
}
//供应商提现
function addCash(){
    if($("#addFm").valid()) {//表单验证
        $.tokenAjax({
            url: '/supplierCash/cash',
            type: 'post',
            data: $("#addFm").serialize(),
            success: function (data) {
                if (data.retCode == 200) {
                	if(data.retEntity == 599){
                		layer.msg("账户余额不足!", {icon: 5,time:1500})
                	}else if(data.retEntity == 501){
                		layer.msg("会话超时!", {icon: 5,time:1500})
                	}else{
                    	layer.msg("申请成功!", {time: 1500, icon: 1},function(){
                        searchCash(1,5);
                  		$('.offerDiv').hide();
                    });
                	}
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