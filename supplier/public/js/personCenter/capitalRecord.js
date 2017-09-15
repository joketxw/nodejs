require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {
    searchRecord(1,5);
    }
);

function searchRecord(pageNum,pageSize){
    $.tokenAjax({
        url: '/supplierCash/searchRecord',
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
                        hml+='<div class="wth20">'+dto.operatorName+'</div>';
                        hml+='<div class="wth20">'+dto.intTotal+'</div>';
                        hml+='<div class="wth20">'+dto.outTotal+'</div>';
                        hml+='<div class="wth20">'+dto.balance+'</div>';
                        if(dto.tradeType==1){
                        hml+='<div class="wth20">交易</div>';
                        }
                        if(dto.tradeType==2){
                        hml+='<div class="wth20">提现</div>';
                        }
                        hml+='<div class="wth20">'+dto.addTime+'</div>';
                        hml+='</li>';
                    });
                    $(".subMangerUl").html(hml);
                    common.layPageInit('layPageBox', pages, pageNum ,function(pageNum){
                        searchRecord(pageNum,pageSize);
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
