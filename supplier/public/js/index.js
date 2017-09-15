
require(
    ['jquery','laypage','layer','laydate','validate','common','sideRight'],
    function($,laypage,layer,laydate,validate,common) {
        searchGoods(1,10,'','142');



        var goodsId = common.getUrlParam("goodsId");

        $(".yellowBottom:first").show();  //默认显示全部
        $(".accessoriesClass li").click(function(){
            $(".accessoriesClass li i").hide();
            $(this).find("i").show();
        });
        $(".accessoriesClass li").click(function(){
            var categoryids= $(this).attr("categoryids");
            if(categoryids==0){      //全部
                getPartsCategoryGoodsList(goodsId,1,100)
            }else {
                getGoodsList(categoryids);
            }

        })
    }
);



function searchGoods(pageNum,pageSize,title,categoryIdf){
    $.tokenAjax({
        url: '/supplier/goods/searchGoods',
        type: 'post',
        async: false,//将异步改成同步
        data: {pageNum:pageNum,pageSize:pageSize,title:title,categoryIdf:categoryIdf},
        success: function (data) {
            if (data.msgCode == 200){
                var list=data.list;
                var hml='';
                $(list).each(function (ix, dto) {



                });

            }
        }
    })
}