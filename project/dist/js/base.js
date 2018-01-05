

var  globalData={};

globalData.url='http://logostore.yuanchuangyuan.com';
//globalData.url='zc.test.com';
//globalData.url='http://172.16.9.188/find_a_store';

//设置根字节大小
document.documentElement.style.fontSize=document.documentElement.clientWidth*2/7.5+'px';

window.onresize=function(){
    document.documentElement.style.fontSize=document.documentElement.clientWidth*2/7.5+'px';
}