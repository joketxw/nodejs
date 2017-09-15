
require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],

    function($,laypage,layer,laydate,validate,common) {
        /************* 验证规则 start *****************/
        $('#resetPassword').validate({
            rules:{
                oldPassWord:{required: true, minlength: 6, maxlength: 16},
                newPassWord: { required: true, minlength: 6, maxlength: 16},
                rePassWord:{required:true,equalTo: "#newPassWord"}
            },
            messages:{
                oldPassWord:{required: '请输入原密码',minlength: '原密码长度不能少于6个字符',maxlength: '原密码长度不能超过16个字符'},
                newPassWord: {required: '请输入密码',minlength: '新密码长度不能少于6个字符',maxlength: '新密码长度不能超过16个字符'},
                rePassWord: {required: '请确认密码',equalTo: '两次密码不一致'}
            }
        });

        $("#resetPasswordBtn").click(function(){
            if($("#resetPassword").valid()){//表单验证
                var $self = $(this);
                $self.attr("disabled",true);
                resetPassword($self);
            }
        });

        /************* 验证规则 end *****************/


    }
);

//修改密码
function resetPassword($self){
    $.tokenAjax({
        url: '/supplier/user/modifyPwd',
        type: 'post',
        data: $("#resetPassword").serialize(),
        success: function (data) {
            if (data.retCode==1602){
                $self.attr("disabled",false);
                layer.msg('修改密码成功!', {icon: 1,time:800})
            }else if(data.retCode==1303){
                $self.attr("disabled",false);
                layer.msg('请输入正确的原密码!', {icon: 5,time:800})
            }else if(data.retCode==1421){
                $self.attr("disabled",false);
                layer.msg('输入的新账号密码与原密码一样!', {icon: 5,time:800});
            }else if(data.retCode==1106){
                $self.attr("disabled",false);
                layer.msg('输入的确认密码与输入的新账号密码不一样!', {icon: 5,time:800});
            }else if(data.retCode==500){
                $self.attr("disabled",false);
                layer.msg('服务器报错!', {icon: 5,time:800});
            }
        }
    })
}