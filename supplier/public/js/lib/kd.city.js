/**
 * Created by Administrator on 2016/12/20 0020.
 */
/**
 * Created by Neng.Gao on 2016/12/1 0001.
 * description : 公共方法
 */

define(['jquery'], function($) {

    function City(json){
        this.init(json)
    }
    City.prototype = {
      self : $(this),
      init : function(json){
          this.self.find("em").on("click",function(){
              alert(1);
              $(this).parent().find("ul").show();
          })
      },
      getProvince : function(){

      },
      getCity : function(){

      },
      getArea : function(){

      }
    };
    return City;
});
