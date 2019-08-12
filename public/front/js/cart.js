$(function() {
   
 function render() {
  setTimeout(function(){
    $.ajax({
      type:"get",
      url:"/cart/queryCart",
      dataType:"json",
      success:function(info) {
        console.log(info);
        if(info.error === 400){
          // 未登录 拦截到登录页
          location.href = 'login.html'
          return
        }
        // 已登录，渲染页面
        var htmlStr = template("cartTpl", { arr: info });
        $(".lt_main .mui-table-view").html(htmlStr);

        // 请求完数据之后 结束下拉刷新
        //  mui('.mui-scroll-wrapper').pullRefresh().endPullDownToRefresh();
         mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
      }
    })
  },500)
 }

// 2.配置下拉刷新
mui.init({
  pullRefresh : {
    container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down : {
      auto: true,//可选,默认false.首次加载自动下拉刷新一次
      callback : function(){   //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        console.log('下拉刷新了');
        
        render()
      } 
    }
  }
});

// 3.删除功能
  // 这里注意：
  // 1。因为 结构是通过模板动态渲染的 所有要用事件委托注册
  // 2. mui插件默认禁用了a的click事件 因为a有300ms延迟，影响性能 需要使用tap事件
$('.lt_main').on('tap','.btn_del',function() {
  // 删除要根据产品id删除
  var id = $(this).data('id')
  console.log('点击了删除按钮');
  
  mui.confirm('您确定删除该项吗？','温馨提示',['是','否'], function(e) {
    if(e.index === 0) {
      //  点击了确定按钮 发送ajax请求 删除操作
      $.ajax({
        type:"get",
            url:"/cart/deleteCart",
            data:{
                id: [id]
            },
            dataType:"json",
            success:function(info) {
              console.log(info);
              if(info.success) {
                // 删除成功，只需要重新刷新页面
                // 调用一次下拉刷新
                mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()
              }
              
            }
      })
    }
  })
})

// 4.编辑功能
// 编辑功能 需要的参数有：
  // 尺码：size   数量：num 
$('.lt_main').on('tap','.btn_edit', function() {
  // 获取参数
  // 在html5中有一个方法dataset 可以一次性获取所有 自定义属性的值
  //这里为什么不是用$(this)呢？
    // $(this)是jQuery对象    $(this)=jQuery(this) 返回的是一个jquery对象 。
    // this返回的是一个html对象
    // 而这里的dataset是 html5中的方法 所以只有this才能调用
  var obj = this.dataset;

  // 生成模板
  var htmlStr = template('editTpl',obj)

  // 在mui插件中 默认会将html结构中的 \n 换行符 生成 <br> 换行标签自动换行
  // 我们这里的尺码样式中不需要 所有要将 \n 去掉 利用replace()方法
  htmlStr = htmlStr.replace(/\n/g,'')  //表示把 \n 替换成 '' g:表示全局的 就是把所有的都替换掉 

  mui.confirm(htmlStr,'编辑商品',['确定','取消'], function(e) {
    if(e.index === 0){
      // 点击的确定按钮
      var size = $('.lt_size span.current').text();
      var num = $('.mui-numbox-input').val()
      var id = obj.id   

      $.ajax({
        type:'post',
        url:"/cart/updateCart",
        data:{
          id:id,
          size:size,
          num:num
        },
        dataType:'json',
        success:function(info) {
          console.log(info);
          if(info.success) {
            // 编辑成功 重新刷新页面 调用下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
          }
        }
      })
    }
  })

  // 初始化数字输入框
  mui('.mui-numbox').numbox()

 // 让尺码可以被选中
 //  这次事件委托，因为这里的模板结构的父元素直接就是body
 $('body').on('click','.lt_size span', function() {
   $(this).addClass('current').siblings().removeClass('current')
 })  

})

})