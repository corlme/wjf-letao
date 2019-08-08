$(function() {
  // 前端校验功能 1.用户名不能为空 2.密码不能为空 3.密码在6-18个字符内

  $("#form").bootstrapValidator({
    //校验提示图标
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok", //校验成功  valid：有效的
      invalid: "glyphicon glyphicon-remove", // 校验失败 invalid:无效
      validating: "glyphicon glyphicon-refresh" //validating:校验中
    },
    // 配置校验字段
    fields: {
      username: {
        // 配置校验规则
        validators: {
          // 非空
          notEmpty: {
            // 提示信息
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6
          },
          callbck: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  });


  // 登录功能
  // 表单校验插件会在提交表单时进行校验
  // *    (1) 校验成功, 默认就提交表单, 会发生页面跳转,
  // *        我们需要注册表单校验成功事件, 阻止默认的提交, 通过ajax进行发送请求
  // *    (2) 校验失败, 不会提交表单, 配置插件提示用户即可
  $('#form').on('success.form.bv',function(e){
      e.preventDefault()    //阻止表单默认提交
     $.ajax({
       type:'post',
       url:'/employee/employeeLogin',
       data: $('#form').serialize(),   //serialize()表单序列化，用于收集表单数据
       dataType:'json',
       success: function(info){
        console.log(info);
        if(info.success){
          // 登录成功，跳转页面
          location.href = 'index.html';
          localStorage.setItem('myToken', info.data.token)
        }
        if(info.error === 1000){
          // 说明用户名不存在  更新校验状态
          // updateStatus 更新校验状态
            //   1 字段名称
            //   2 校验状态  VALID校验成功 INVALID校验失败   NOT_VALIDATED未校验的 VALIDATING：校验中的
            //   3 校验规则 用户提示指定文本
          $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback')
        }
        if(info.error === 1001){
          // 密码错误
          $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback')
        }
       }
     })
  })
  // 重置功能
  $('[type="reset"]').click(function(){
    // resetForm(boolean)
        //    1 传true,重置内容以及校验状态
        //    2.传false,只重置校验状态
    $('#form').data('bootstrapValidator').resetForm()
  })
});
