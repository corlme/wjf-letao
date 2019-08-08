$(function(){
  var currentPage = 1;
  var pageSize = 5;
  
  render();

  function render () {
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        
        var htmlStr = template('tpl',info)
        $('tbody').html(htmlStr);

        // 分页初始化
        $('#paginator').bootstrapPaginator({
          // 指定版本
          bootstrapMajorVersion: 3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total / info.size),
          size:'normal',
          onPageClicked:function(a,b,c,page){
            currentPage = page,
            render()
          }
        })
      }
    })
  }
 
  // 添加分类功能
  $('#addBtn').click(function(){
    console.log(111);
    $('#addModal').modal('show');
  })

  // 使用表单插件 实现校验
  $('#form').bootstrapValidator({
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',  //校验成功  valid：有效的
      invalid: 'glyphicon glyphicon-remove',   // 校验失败 invalid:无效
      validating: 'glyphicon glyphicon-refresh'  //validating:校验中
    },
    // 配置字段
    fields:{
      categoryName: {
        //  校验规则
           validators: {
            notEmpty: {
               message:'一级分类名不能为空'
            }
           }
       }
    }
  })

  // 注册表单校验成功事件，阻止默认提交 通过ajax提交
  // success.form.bv  是 bootstrap-validator 校验插件提供的
  $('#form').on('success.form.bv', function(e){
    console.log(e);
    
    e.preventDefault()
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data: $('#form').serialize(),  //表单序列化提交
      dataType:'json',
      success:function(info){
        console.log(info);
        
        // 添加成功，关闭模态框 刷新页
        $('#addModal').modal('hide')
        // 页面重新渲染，让用户看到第一页数据
        currentPage = 1;
        render()
        // 重置表单  resetForm(true) 加true 重置内容和校验规则
        $('#form').data('bootstrapValidator').resetForm(true);
      }
    })
  })

})