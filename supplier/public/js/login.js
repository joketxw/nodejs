/**
 * Created by Neng.Gao on 2016/12/22.
 */
require(
    ['jquery','layer','validate','common'],

    function($,layer,validate,common) {

        $(".freeRegistration").click(function(){
            location.href="/register"
        });
        /************* 验证规则 start *****************/
        $('#loginForm').validate({
            rules:{
                femailAccount:{required: true},
                fpassword: { required: true, minlength: 6, maxlength: 16}
            },
            messages:{
                femailAccount:{required: '用户名不能为空'},
                fpassword: {required: '请输入密码',minlength: '密码长度不能少于6个字符',maxlength: '密码长度不能超过16个字符'}
            }
        });
        /*
        $.validator.addMethod(
            "uerName",
            function(value,element){
                return value && (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/i.test(value) || /^1[34578]\d{9}$/i.test(value));
            },
            "请输入符合规则的电子邮箱或手机号"
        );
        */
        /************* 验证规则 end *****************/


        /************* 登录 start *****************/
        var $sign = $(".loginBtn"),$userName = $("#userName"),$password = $("#passWord");
        $sign.click(function(){
            if($("#loginForm").valid()){//表单验证
                var $self = $(this);
                $self.attr("disabled",true);
                $.ajax({
                    url: '/supplier/user/login',
                    type: 'post',
                    data: $("#loginForm").serialize(),
                    success: function (data) {
                        $self.attr("disabled",false);
                        var retCode = data.retCode;
                        if (retCode == 200) {
                            console.log(data);
                            layer.msg("欢迎回来!",{time:800,icon:6},function(){
                                window.location.href = '/commodityManger';
                            });
                        }else{
                            layer.msg(data.retMsg,{time:800,icon:2})
                        }
                    }
                });
            }
        });
        // 回车模拟点击登录
        $('.uerName').on('keydown',function(ev){
            if(ev.which == 13 && $password.val() != ''){
                $sign.trigger('click');
            }
        });
        $('.passWord').on('keydown',function(ev){
            if(ev.which == 13 && $userName.val() != ''){
                $sign.trigger('click');
            }
        });
        /************* 登录 end *****************/
    }
);