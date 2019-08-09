// 利用进度条插件，实现进度条功能
// 需要配黑jQuery全局方法使用

// ajaxStart 在ajax发送开始时调用的全局函数
$(document).ajaxStart(function(){
  NProgress.start()  //开启进度条
})

$(document).ajaxStop(function(){
  NProgress.done()  //开启进度条
})


// 登录拦截功能
if(location.href.indexOf('login.html') === -1){
  // 说明地址栏中没有login.html 说明不是登录页，需要校验拦截
  // 发送ajax请求 后台校验
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    dataType:'json',
    success:function(info){
      if(info.success){
        // 说明登录成功 继续访问
        console.log('登录成功');
        
      }
      if(info.error === 400){
         // 说明未登录，拦截到登录页
        location.href = 'login.html'
      }
    }
  })
}


$(function(){
  // 左侧下拉菜单显示
  $('.nav .category').click(function(){
      $('.nav .child').stop().slideToggle();  //slideDown:向下动画 slideToggle:切换动画
  })
  // 左侧隐藏
  $('.lt_main .icon_menu').click(function(){
    $('.lt_aside').toggleClass('hidemenu');
    $('.lt_topbar').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu')
  })

  // 退出模态框
  $('.icon_logout').click(function(){
    $('#logoutModal').modal('show');
  })


  // 退出功能
  $('#logoutBtn').click(function(){
    $.ajax({
      type:'get',
      url:'/employee/employeeLogout',
      dataType:'json',
      success:function(info){
       if(info.success){
        // 退出成功 跳转登录页
        location.href = 'login.html';
       }
      }
    })
  })




})


