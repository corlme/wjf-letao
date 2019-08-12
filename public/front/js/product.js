$(function() {
  // 从地址获取传递多来的参数
  var productId = getSearchUrlParams('productId')
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    dataType: "json",
    success:function(info){
      console.log(info);
      var htmlStr = template('productTpl', info)
      $('.lt_main .mui-scroll').html( htmlStr );
      
      // 手动初始化轮播图
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
      });
      
      // 手动初始化数字框
      mui('.mui-numbox').numbox()
    }
  })

  // 1.给尺码添加选中功能
  $('.lt_main').on('click', '.lt_size span', function() {
    $(this).addClass('current').siblings().removeClass('current')
  })
  
  // 2.加入购物车功能
   // (1) 给加入购物车按钮添加点击事件
  // (2) 获取用户选中的尺码和数量
  // (3) 发送 ajax 请求, 进行加入购物车操作
  $('#addCart').click(function() {
    var size = $('.lt_size span.current').text()
    var num = $('.mui-numbox-input').val()
    console.log(size,num);
    
    if(!size){
      mui.toast('请选择尺码')
      return
    }
    // 发送 ajax 请求, 进行加入购物车
    $.ajax({
      type:'post',
      url:'/cart/addCart',
      data:{
        productId:productId,
        size:size,
        num:num
      },
      dataType:'json',
      success:function(info){
        console.log('111',info);
        if(info.success){
          // 如果成功 弹出一个确认框
          mui.confirm('添加成功','温馨提示',['去购物车','继续浏览'],function( e ) {
            if(e.index === 0){
              // 去购物车
              // location.href = 'cart.html'
            }
          })
        }

        if(info.error === 400){
          // 用户没有登录
          // 跳转到登录页, 将来登录成功, 需要跳回来
          // 可以将当前页面的地址传递给登录页, 将来登录成功后, 获取传递过来的地址, 跳回来
          location.href = 'login.html?retUrl=' + location.href;
        }
      }

    })
  })




})