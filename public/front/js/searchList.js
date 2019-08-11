$(function() {
  // 1.获取地址栏参数 调用已经封装好的方法
  var key = getSearchUrlParams("key");
  console.log(key);
  $(".search_input").val(key);

  // 获取到input框的值后 请求数据进行渲染
  render();
  
  function render() {
    // 每次渲染的时候 都添加加载的效果
   $('.lt_product').html('<div class="loading"></div>')

    // 三个必传的参数
    var params = {};
    params.proName = $(".search_input").val(); //搜索关键字
    params.page = 1;
    params.pageSize = 100;

    // 两个可选的参数
    // 通过判断有没有高亮的a标签，来决定需不需要传递排序的参数
    var $current = $('.lt_sort a.current')
    if($current.length > 0){
      //  当前有高亮的a标签 需要进行排序 按照什么进行排序
      var sortName = $current.data('type');      // price 或者 num  就是点击的a
      // 升序还是降序，通过箭头的方向来判断 （1升序 2降序）
      var sortValue = $current.find('i').hasClass('fa-angle-down') ? 2 : 1;

      // 将参数添加到params中
      params[sortName] = sortValue;
    }

    // 添加定时器 模拟网络延迟  真实工作中不要加
    setTimeout(function(){
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function(info) {
          console.log("搜索列表数据",info);
          
          var htmlStr = template("productTpl", info);
          $(".lt_product ul").html(htmlStr);
        }
      });
    },1000)
  }

  // 2.点击搜索 功能
  $(".search_btn").click(function() {
    // 获取input框的值
    var key = $(".search_input").val();

    // 要判断非空
    if (key.trim() === "") {
      mui.toast("请输入搜索关键字", {
        duration: 3000
      });
      return;
    }

    render();

    // 还要把key存到本地历史记录列表中
    //  获取本地历史记录
    var history = localStorage.getItem("search_list");
    // 转成数组
    var arr = JSON.parse(history);

    // 排除重复项
    var index = arr.indexOf(key);
    if (index != -1) {
      arr.splice(index, 1);
    }

    // 长度不能超过10
    if (arr.length >= 10) {
      arr.pop(); //删除最后一项
    }

    arr.unshift(key);

    // 在转成字符串存入
    localStorage.setItem("search_list", JSON.stringify(arr));
  });

  // 3.点击切换a.current
  $('.lt_sort a[data-type]').click(function(){
    if($(this).hasClass('current')){
      // 有current类，切换箭头方向
      $(this).find('i').togglClass('fa-angle-down').togglClass('fa-angle-up')
    } else {
      // 没有current类
      $(this).addClass('current').siblings().removeClass('current')
    }
    // 重新渲染
    render()
  })


});
