/**
 * Created by Neng.Gao on 2016/12/23.
 */
require(
    ['jquery','layer','validate','common'],

    function($,layer,validate,common) {
        /************* 验证规则 start *****************/
        $('#registerForm').validate({
            rules:{
                femailAccount:{required: true, minlength: 6, maxlength: 35},
                fpassword: { required: true, minlength: 6, maxlength: 16},
                fphone:{ required: true, minlength: 6, maxlength: 16},
                fname:{ required: true, minlength: 2, maxlength: 4},
                remarks:{ required: false},
                verifyPassWord:{required:true,equalTo: "#fpassword"}
            },
            messages:{
                femailAccount:{required: '请输入用户名',minlength: '用户名不低于6个字符',maxlength: '用户名不超过35个字符'},
                fpassword: {required: '请输入密码',minlength: '密码长度不能少于6个字符',maxlength: '密码长度不能超过16个字符'},
                verifyPassWord:{required:"请先填写密码", equalTo:'两次密码不一致'},
                fphone:{required: '请输入密码',minlength: '密码长度不能少于6个字符',maxlength: '密码长度不能超过16个字符'},
                fname:{required: '请输入联系人姓名',minlength: '姓名长度不能少于2个字符',maxlength: '姓名长度不能超过4个字符'}
            }
        });
        $.validator.addMethod(
            "emailAccount",
            function(value,element){
                return value && /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/i.test(value);
            },
            "请输入符合规则的电子邮箱"
        );
        $.validator.addMethod(
            "fphone",
            function(value,element){
                return value && /^1[34578]\d{9}$/i.test(value);
            },
            "请输入符合规则的手机号"
        );
        /************* 验证规则 end *****************/



        /************* 注册 start *****************/

        var $register0 = $("#registerBtn");
        $register0.click(function(){
            if($("#registerForm").valid()){//表单验证
                if($("#agreementCheck").is(':checked')){
                    $.ajax({
                        url: '/supplier/user/register',
                        type: 'post',
                        data: $("#registerForm").serialize(),
                        success: function (data) {
                           /* $self.attr("disabled",false);*/
                            var retCode = data.retCode;
                            var retMsg=data.retMsg;
                            if (retCode == 1904||retCode == 200){
                                console.log(data);
                                layer.msg("注册成功!",{time:800,icon:1},function(){
                                    $(".d1").removeClass("active");
                                    $(".d2").addClass("active");
                                    $("#setUserBox1").hide();
                                    $("#setUserBox2").show();
                                    setTimeout('location.href="/login"',5000)
                                });
                            }else{
                                if(retMsg==null||retMsg==""){
                                    layer.msg('接口错误',{time:1500,icon:1})
                                }else{
                                    layer.msg(retMsg,{time:1500,icon:1})
                                }
                            }
                        }
                    });
                }else {
                    layer.msg("您还没有同意协议!",{icon:6})
                }
            }
        });


       /* var $sign = $(".loginBtn"),$userName = $("#userName"),$password = $("#passWord");
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
                        var code = data.msgCode;
                        if (code == 200) {
                            console.log(data);
                            layer.msg("欢迎回来!",{time:800,icon:6},function(){
                                //预加载首页图片
                            });
                        }else if(code == 501){
                            layer.msg("账户已被冻结",{icon:2})
                        }else if(code == 502){
                            layer.msg("密码错误",{icon:2})
                        }else if(code == 503){
                            layer.msg("账户不存在",{icon:2})
                        }else{
                            layer.msg("服务器异常",{icon:2})
                        }
                    }
                });
            }
        });
        // 回车模拟点击登录
        $userName.on('keydown',function(ev){
            if(ev.which == 13 && $password.val() != ''){
                $sign.trigger('click');
            }
        });
        $password.on('keydown',function(ev){
            if(ev.which == 13 && $userName.val() != ''){
                $sign.trigger('click');
            }
        });*/
        /************* 注册 end *****************/

    }
);