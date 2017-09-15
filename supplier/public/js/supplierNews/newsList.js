require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],

    function($,laypage,layer,laydate,validate,common) {
        messageList(1,4);
        //获取详情点击
        $(document).on("click", "#searchBtn", function () {
        	var className = $(this).parent().parent().attr('class');
        	var fnewsId = $(this).parent().parent().attr('fnewsId');
			if(className == 'unreadMsg'){
        		$(this).parent().parent().attr('class','readMsg');
				updateMsgState(fnewsId);
			}
            $(this).parent().parent().parent().find('.nextDiv1').slideToggle();
        });
        //删除点击
        $(document).on("click", "#deleteBtn", function () {
        	var fnewsId = $(this).parent().parent().attr('fnewsId');
        	layer.confirm('确定删除?', function(){ 
			deleteNews(fnewsId);
		});
        });
    });

//获取列表
function messageList(pageNum,pageSize){
    $.tokenAjax({
        url: '/supplierNews/show',
        type: 'post',
        data: {pageNum:pageNum,pageSize:pageSize},
        success: function (data) {
        	if(data.retMsg==null&&data.retEntity.msgString!=null){
        		$('.discusUl').html('<div class="doing">'+data.retEntity.msgString+'</div>');
        	}else{
        		if (data.retCode==200){
                var common = require("common");
                var hml="";
                var pages =Math.ceil(data.retEntity.totalCount/pageSize);
                var list =data.retEntity.list;
                $(list).each(function (ix, dto) {
                    hml+='<div id="knowReleaseLis">';
                    if(dto.ftagState==0){
                    hml+='<li class="readMsg" fnewsId="'+dto.fnewsId+'">';
                    }else{
                    hml+='<li class="unreadMsg" fnewsId="'+dto.fnewsId+'">';
                    }
                    hml+='<span class="discusLiT">'+dto.fnewsTitle+'</span>';
                    hml+='<span class="col-b"><a id="searchBtn">[ 点击查看 ]</a></span>';
                    hml+='<span class="timeT">'+dto.fnewsTime+'</span>';
                    hml+='<span class="del"><a id="deleteBtn">删除</a></span></li>';
                    hml+='<div class="nextDiv1"><div class="contentT">'+dto.fnewsContent+'</div>';
                    hml+='</div></div>';
                });
                $('.discusUl').html(hml);
                common.layPageInit('layPageBox', pages, pageNum ,function(pageNum){
                        messageList(pageNum,pageSize);
                    });
            }else {
            	layer.msg(data.retMsg, {icon: 5,time:1500});
            }
        	}
        }
    })
}

//根据id删除
function deleteNews(id){
    $.tokenAjax({
        url: '/supplierNews/remove',
        type: 'post',
        data: {fnewsId:id},
        success: function (data) {
            if (data.retCode==200){
                layer.msg('删除成功!', {icon: 1, time: 1500});
                messageList(1,4);
            }else {
                layer.msg(data.retMsg, {icon: 1,time:1500})
            }
        }
    })
}
//根据id修改状态
function updateMsgState(id){
    $.tokenAjax({
        url: '/supplierNews/modifyState',
        type: 'post',
        data: {fnewsId:id},
        success: function (data) {
            if (data.retCode==200){
            	
            }else {
                layer.msg(data.retMsg, {icon: 1,time:1500})
            }
        }
    })
}