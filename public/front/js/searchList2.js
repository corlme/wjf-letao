$(function() {
  // 功能1.获取地址栏参数 赋值给input框
  // var key = getSearchUrlParams('key')
  $('.search_input').val(getSearchUrlParams('key'))
  // 获取值后立马渲染页面
  render()



  // 功能2.点击搜索按钮，实现搜索功能
  $('.search_btn').click(function() {
    var key = $('.search_input').val(); //获取input框的值
    // 不能为空
    if(key.trim() === ''){
      mui.toast('请输入搜索关键字')
      return;
    }
    render()
    // 然后还有把key添加到本地历史记录中
    var arr = JSON.parse(localStorage.getItem('search_list') || '[]')
    // 不能超过10个
    if(arr.length >= 10){
      arr.pop()
    }
    // 不能重复
    var index = arr.indexOf( key )
    if(index != -1){
      arr.splice(index,1)
    }
    arr.unshift(key)
    localStorage.setItem('search_list',JSON.stringify( arr ))

  })



  // 功能3.添加排序功能（点击切换类）
  $('lt_sort a[data-type]').click(function() {
    if($(this).hasClass('current')){
      // 如果有 就切换箭头方向
      $(this).find('i').togglClass('fa-angle-down').togglClass('fa-angle-up')
    } else {
      // 如果没有 就给自己加上 移除其他的current
      $(this).addClass('current').siblings().removeClass('current')
    }
    // 渲染页面
    render()
  })



  // 整个页面核心功能render
  function render() {
    // 添加加载的效果
    $('.lt_product').html('<div class="loading"></div>')
    var params = {}
    // 三个必传参数
    params.proName = $('.search_input').val()
    params.page = 1
    params.pageSize = 100
    // 两个可选参数 
    // 1.是否需要排序：通过判断高亮的a 来决定是否需要排序
    // 2.排序规则：通过判断箭头方向 升序还是降序 1升序 2降序
    var $current = $('.lt_sort a.current');
    if($current.length > 0){
      // 说明有高亮的a 需要排序 就通过箭头方向判断排序
      // 1.排序的项  2.排序的值
      var sortName = $current.data('type') //获取到当前点击项的type 是 price 或者 num
      var sortValue = $current.find('i').hasClass('fa-angle-down') ? 2 : 1
      params[ sortName ] = sortValue
    }
    $.ajax({
      type: 'get',
      url: '',
      data: params,
      dataType: 'json',
      success:function(info){
        console.log(info);
        var htmlStr = template('productTpl',info);
        $('.lt_product ul').html(htmlStr)
      }
    })
  }


});
