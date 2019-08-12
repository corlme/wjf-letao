$(function() {

  // 一进入页面 请求当前用户数据 进行页面渲染
    // (1)用户已登录，后台返回用户数据，进行模拟渲染
    // (2)用户未登录，后台返回error，当前用户未登录 拦截到登录页面

  $.ajax({
    type:"get",
    url:"/user/queryUserMessage",
    dataType:"json",
    success:function(info) {
      console.log(info);
      // 未登录 拦截到登录页
      if(info.error === 400){
        location.href = 'login.html'
      }
      // 已登录
      var htmlStr = template('userTpl',info)
      $('#userInfo').html(htmlStr)
    }
  })

  // 退出功能
  $('.logoutBtn').click(function() {
    mui.confirm('您确定退出登录吗？','温馨提示',['确定','取消'],function(e) {
      if(e.index === 0) {
        $.ajax({
          type:"get",
          url: "/user/logout",
          dataType:"json",
          success:function(info) {
            // 退出成功 跳转登录页
            location.href = 'login.html'
          }
        })
      }
    })
  })
})