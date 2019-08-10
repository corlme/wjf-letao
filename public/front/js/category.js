$(function () {
  // 1.一进入页面就发送请求，获取一级分类数据 进行渲染
  render()
  function render () {
    $.ajax({
      type:'get',
      url:'/category/queryTopCategory',
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr = template('leftTpl',info)
        $('.lt_category_left ul').html(htmlStr)

        // 获取到一级分类数据后，首页也要渲染一级分类对应的二级分类数据
        renderSecondById(info.rows[0].id)
      }
    })
  }

  // 2.通过事件委托，给所有的a绑定点击事件，点击a切换二级分类数据
  $('.lt_category_left').on('click','a',function(){
    // 点击后，给自己添加current类 移除其他a的current
    $(this).addClass('current').parent().siblings().find('a').removeClass('current')  // 实现点击高亮

    // 同时获取点击的a的id ，根据id 渲染二级分类数据
    var id = $(this).data('id');
    renderSecondById(id)
  })



  // 封装一个方法，专门用来根据一级分类id 获取右侧二级分类数据
  function renderSecondById (id) {
   $.ajax({
     type:'get',
     url:"/category/querySecondCategory",
     data:{
       id: id
     },
     dataType:'json',
     success:function(info){
       var htmlStr = template('rightTpl',info)
       $('.lt_category_right ul').html(htmlStr)
     }
   })
  }




})