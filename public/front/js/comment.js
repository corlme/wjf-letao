$(function() {
  // 1.图片轮播
  //初始化轮播图控件
  var banner = mui(".mui-slider");
  banner.slider({
    interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
  });

  // 初始化区域滚动控件
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条
  });

});

// 用于获取地址栏参数的函数
function getSearchUrlParams ( k ) {
  //  获取地址栏参数
   var search = location.search  // "?name=%E5%8C%A1%E5%A8%81&age=18&desc=%E5%B8%85"
  // 解码成中文
   search = decodeURI(search)    //"?name=匡威&age=18&desc=帅"
  //  去掉问号 slice(1):表示从下标1开始截取到最后 返回数组
  search = search.slice(1)       // "name=匡威&age=18&desc=帅"
  // 通过&分割成数组
  var arr = search.split('&')    //["name=匡威", "age=18", "desc=帅"]
  
  // 然后把数组转成对象，利于取数据，这里就要遍历数组了
  // forEach():是for循环的简化版，适用于循环次数未知，遍历数组或者集合，不能对数组或者集合进行修改操作
  // for 循环，则适用于比较复杂的遍历
  var obj = {}
  arr.forEach(function(v,i){  //这里的v就是每一项 "name=匡威"
   var key = v.split('=')[0]  // 'name'
   var value = v.split('=')[1]  // 匡威
  // [] 语法会解析变量
    obj[key] = value
  })
  return obj[k]
  
 }

