/**
 * Created by Neng.Gao on 2016/12/1 0001.
 */
require.config({
    baseUrl:'/js/lib',
    map: {
        '*': {
            'css': 'require/css.min'
        }
    },
    paths: {
        'jquery': 'jquery/jquery.min',  //jquery1.11.1
        'laypage': 'laypage-v1.3/laypage',//分页组件
        'layer': 'layer-v2.4/layer',//弹出层插件
        'laydate':'laydate/laydate',//日期插件
        'validate': 'jquery-validate/jquery.validate.min',//校验组件
        'common' : 'common',//公用方法
        'sideLeft':'../common/sideLeft', //左侧边栏导航
        'sideRight': '../common/sideRight',//右 侧边栏
        'SuperSlide':'../common/jquery.SuperSlide', //全屏轮播
        'active':'../common/active' //全屏轮播
    },
    shim: {
        /**
         * exports 导出全局变量
         * deps依赖的组件
         */
        'laypage': {
            deps: [
                'jquery',
                'css!laypage-v1.3/skin/laypage'
            ]
        },
        'layer': {
            deps: [
                'jquery',
                'css!layer-v2.4/skin/layer'
            ]
        },
        'validate': {
            deps: ['jquery']
        },
        'laydate': {
            deps: ['jquery']
        },
        'common':{
            deps:['jquery']
        },
        'SuperSlide':{
            deps:['jquery']
        },
        'sideLeft': {
            deps: ['jquery']
        },
        'sideRight': {
            deps: ['jquery']
        }
    },
    waitSeconds:0
});
