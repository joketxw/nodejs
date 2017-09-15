require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {
    searchChildAccount(1,5);
    $('#addFm').validate({
            rules:{
                fname:{ required: true},
                fpassword:{ required: true, minlength: 6, maxlength: 16},
                repassword:{ required: true, minlength: 6, maxlength: 16,equalTo: "#fpassword"},
                fdepartmentId:{ required: true},
                province:{ required: true},
            },
            messages:{
                fname:{required: '姓名不能为空'},
                fpassword:{required: '密码不能为空',minlength: '密码长度不能少于6个字符',maxlength: '密码长度不能超过16个字符'},
                repassword:{required: '确认密码不能为空',minlength: '确认密码长度不能少于6个字符',maxlength: '确认密码长度不能超过16个字符',equalTo: '两次密码不一致'},
                fdepartmentId:{required: '角色'},
                province:{required: '省份不能为空'},
            }
       });
    $(document).on("click", "#dj", function (){
            var fuserId=$(this).parents('li').attr("fuserId");
            var fjoinsStatus=$(this).parents('li').attr("fjoinStatus");
            blockedAccount(fuserId,fjoinsStatus);
    });
    $(document).on("click", "#jc", function (){
            var fuserId=$(this).parents('li').attr("fuserId");
            var fjoinsStatus=$(this).parents('li').attr("fjoinStatus");
            blockedAccount(fuserId,fjoinsStatus);
    });
    $(document).on("click", "#delete", function (){
            var fuserId=$(this).parents('li').attr("fuserId");
            layer.confirm('确定删除?', function(){ 
            deleteChildAccount(fuserId);
            });
    });
    $(document).on("click", "#addChildBtn", function (){
            searchProvince();
            $('.offerDiv').show();
    });
    $('.addR').click(function(){
            $('.offerDiv').hide();
        });
    $(document).on("click", ".addL", function () {
        addChildAccount();
        });
   }
);

function searchChildAccount(pageNum,pageSize){
    $.tokenAjax({
        url: '/childAccount/search',
        type: 'post',
        data: {pageNum:pageNum,pageSize:pageSize},
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var pages = Math.ceil(data.retEntity.totalCount/pageSize);
                var hml='';
                var common = require("common");
                    $(list).each(function (ix, dto) {
                        hml+='<li fuserId='+dto.fuserId+' fjoinStatus='+dto.fjoinStatus+'>';
                        hml+='<div class="wth20">'+dto.femailAccount+'</div>';
                        hml+='<div class="wth20">'+dto.fname+'</div>';
                        if(dto.fdepartmentId == 1){
                            hml+='<div class="wth20">技术</div>';
                        }
                        if(dto.fdepartmentId == 2){
                            hml+='<div class="wth20">业务</div>';
                        }
                        hml+='<div class="wth20">'+dto.provinceName+'</div>';
                        if(dto.fjoinStatus == 0){
                        hml+='<div class="wth20">正常</div>';
                        }
                        if(dto.fjoinStatus == 1){
                        hml+='<div class="wth20">冻结</div>';
                        }
                        if(dto.fjoinStatus == 0){
                        hml+='<div class="wth20"><a id="dj" href="javascript:void(0);">冻结</a>/<a id="delete" href="javascript:void(0);">删除</a></div>';
                        }
                        if(dto.fjoinStatus == 1){
                        hml+='<div class="wth20"><a id="jc" href="javascript:void(0);">解除</a>/<a id="delete" href="javascript:void(0);">删除</a></div>';
                        }
                        hml+='</li>';
                    });
                    $(".subMangerUl").html(hml);
                    common.layPageInit('layPageBox', pages, pageNum ,function(pageNum){
                        searchChildAccount(pageNum,pageSize);
                    });
                    
            }else if(data.retCode == 1405) {
                var hml='';
                hml+='<div class="doing">没有数据...</div>';
                $(".classList").html(hml);
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
//冻结与解冻操作
function blockedAccount(fuserId,fjoinStatus){
    $.tokenAjax({
        url: '/childAccount/freeze',
        type: 'post',
        data: {fuserId:fuserId,fjoinStatus:fjoinStatus},
        success: function (data) {
            if (data.retCode == 1555){
                layer.msg("操作成功!",{time:800,icon:1});
                    searchChildAccount(1,5);
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
//删除子账号
function deleteChildAccount(fid){
    $.tokenAjax({
        url: '/childAccount/delete',
        type: 'post',
        data: {fuserId:fid},
        success: function (data) {
            if (data.retCode == 1555){
                layer.msg("删除成功!",{time:800,icon:1});
                    searchChildAccount(1,5);
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
//添加子账号
function addChildAccount(){
    if($("#addFm").valid()) {//表单验证
        $.tokenAjax({
            url: '/childAccount/addOrModify',
            type: 'post',
            data: $("#addFm").serialize(),
            success: function (data) {
                if (data.retCode == 1501) {
                    layer.msg("添加成功!", {time: 1500, icon: 1},function(){
                        searchChildAccount(1,5);
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
//查询省份
function searchProvince(){
    $.tokenAjax({
        url: '/childAccount/childProvince',
        type: 'post',
        success: function (data) {
            if (data.retCode == 200){
                var list=data.retEntity.list;
                var hml='';
                var common = require("common");
                    $(list).each(function (ix, dto) {
                        hml+='<option value="'+dto.regionId+'" class="option">'+dto.regionName+'</option>';
                    });
                    $("#province").html(hml);
            }else if(data.retCode == 1405) {
                var hml='';
                hml+='<div class="doing">省份没有数据...</div>';
                $(".offerDiv").html(hml);
            }else{
                    $(".offerDiv").html('省份请求错误');
                if(data.retMsg){
                    layer.msg(data.retMsg, {icon: 5,time:1500})
                }else{
                    layer.msg(data.msgString, {icon: 5,time:1500})
                }
            }
        }
    })
}