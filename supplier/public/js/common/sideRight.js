/**
 * Created by Neng.Gao on 2016/12/1 0001.
 * description : 封装右边侧边栏组件 js
 */
define(['jquery'], function($) {

    var $sideRight = $(".sideRight");
    var $li = $sideRight.find("li");

    $li.eq(-1).on("click",function(){
        $('body,html').animate({ scrollTop: 0 }, 500);
    });
    //鼠标滑动到屏幕90%处 侧边栏显示
    function mouseMove(ev)
    {
        ev = ev || window.event;
        ev = ev.screenX/window.innerWidth > 0.9 ? 0 : $sideRight.width();
        $sideRight.css("right",-ev);
    }
    document.onmousemove = mouseMove;
});