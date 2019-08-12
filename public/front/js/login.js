$(function() {

// 点击确定按钮 校验 发送请求登录
$('#loginBtn').click(function() {
  var username = $('.mui-input-clear').val()
  var password = $('.mui-input-password').val()
  console.log(username,password);

  if(username === ''){
    mui.toast('请输入用户名')
    return
  }
  if(password === ''){
    mui.toast('请输入密码')
    return
  }

  $.ajax({
    type:'post',
    url:'/user/login',
    data:{
      username:username,
      password:password
    },
    dataType:'json',
    success:function(info) {
      console.log(info);
      if(info.success){
        // 登录成功 跳转页面
          //  1.如果是从其他页面跳转过来的 跳回去
          // 2.如果是直接访问的 跳转到用户中心
          if(location.search.indexOf('?retUrl') > -1) {
            // 如果包含 '?retUrl'  location.search.indexOf('?retUrl')的值是 0  ，不包含 值是 -1
            // 这里设置 location.search.indexOf('?retUrl') > -1 就是包含 也就是从别的页面跳过来的
            // location.search =>得到 "?retUrl=http://localhost:3000/front/product.html?productId=7"
            var retUrl = location.search.replace('?retUrl=','')
            location.href = retUrl
          } else {
            location.href = 'user.html'
          }
      }
      if(info.error === 403){
        // 登录失败
      mui.toast(info.message)
      return
      }
      
    }
  })

})



})