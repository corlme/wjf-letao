$(function() {
  var currentPage = 1
  var pageSize = 2
  // 整个页面核心功能render
  function render( callback ) {
    // 添加加载的效果
    // $(".lt_product").html('<div class="loading"></div>');
    var params = {};
    // 三个必传参数
    params.proName = $(".search_input").val();
    params.page = currentPage;
    params.pageSize = pageSize;
    // 两个可选参数
    // 1.是否需要排序：通过判断高亮的a 来决定是否需要排序
    // 2.排序规则：通过判断箭头方向 升序还是降序 1升序 2降序
    var $current = $(".lt_sort a.current");
    if ($current.length > 0) {
      // 说明有高亮的a 需要排序 就通过箭头方向判断排序
      // 1.排序的项  2.排序的值
      var sortName = $current.data("type"); //获取到当前点击项的type 是 price 或者 num
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      params[sortName] = sortValue;
    }
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: params,
      dataType: "json",
      success: function(info) {
        console.log(info);
        // var htmlStr = template("productTpl", info);
        // $(".lt_product").html(htmlStr);
        callback && callback(info)  //如果有callback函数就指定callback函数
      }
    });
  }

  // 功能1.获取地址栏参数 赋值给input框
  var key = getSearchUrlParams("key");
  console.log(key);

  $(".search_input").val(key);
  // 获取值后立马渲染页面
  render();

  // 配置下拉刷新和上拉加载注意点：
    // 1.下拉刷新是原有数据进行覆盖， 执行的是html方法
    //  2. 上拉加载时在原有的数据后面追加  执行的是append方法

  // // 利用mui插件 配置下拉刷新
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        // 配置一进入页面, 就自动下拉刷新一次
        auto: true,
        callback: function() {
          //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          console.log("下拉刷新了");

          // 刷新第一页的数据
          currentPage = 1

          // 注意：在这里下拉刷新是对原有数据的覆盖 使用html方法
          render(function(info){
            var htmlStr = template('productTpl',info)
            $(".lt_product").html(htmlStr);

             // ajax 回来之后, 需要结束下拉刷新, 让内容回滚顶部
            // 注意: api 做了更新, mui文档上还没更新上(小坑)
            //      要使用原型上的 endPulldownToRefresh 方法来结束 下拉刷新
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();

             // 第一页数据被重新加载之后, 又有数据可以进行上拉加载了, 需要启用上拉加载
             mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh();
          });
        }
      },

      // 配置上拉加载
      up : {
        callback : function() {  //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            // 需要加载下一页数据 更新当前页
            currentPage++
            render(function(info) {
            var htmlStr = template('productTpl',info)
            $(".lt_product").append(htmlStr);
             
            // 当数据回来之后 需要结束上拉加载
            // endPullupToRefresh(boolean) 结束上拉加载
            // 1. 如果传 true, 没有更多数据, 会显示提示语句, 会自动禁用上拉加载, 防止发送无效的ajax
            // 2. 如果传 false, 还有更多数据
            if(info.data.length === 0){
              // 没有更多数据了 显示提示语
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( true );
            } else {
              // 还有数据 正常结束上拉加载
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( false );
            }
            })
        } 
      }
    }
  });

  // 功能2.点击搜索按钮，实现搜索功能
  $(".search_btn").click(function() {
    var key = $(".search_input").val(); //获取input框的值
    // 不能为空
    if (key.trim() === "") {
      mui.toast("请输入搜索关键字");
      return;
    }
    // render();
    // 执行一次下拉刷新即可, 在下拉刷新回调中, 会进行页面渲染
    // 调用 pulldownLoading 执行下拉刷新
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()

    // 然后还有把key添加到本地历史记录中
    var arr = JSON.parse(localStorage.getItem("search_list") || "[]");
    // 不能超过10个
    if (arr.length >= 10) {
      arr.pop();
    }
    // 不能重复
    var index = arr.indexOf(key);
    if (index != -1) {
      arr.splice(index, 1);
    }
    arr.unshift(key);
    localStorage.setItem("search_list", JSON.stringify(arr));
  });

  // 功能3.添加排序功能（点击切换类）
  // 在mui插件中 认为上拉加载 和 下拉刷新 使用click会有300ms的延迟，性能方面不足
  // 默认禁用了a标签的click事件  需要绑定tap事件
  // http://ask.dcloud.net.cn/question/8646 文档说明地址

  $(".lt_sort a[data-type]").on('tap' ,function() {
    if ($(this).hasClass("current")) {
      // 如果有 就切换箭头方向
      $(this)
        .find("i")
        .toggleClass("fa-angle-down")
        .toggleClass("fa-angle-up");
    } else {
      // 如果没有 就给自己加上 移除其他的current
      $(this)
        .addClass("current")
        .siblings()
        .removeClass("current");
    }
    // 渲染页面
    // render();

    // 执行一次下拉刷新即可, 在下拉刷新回调中, 会进行页面渲染
    // 调用 pulldownLoading 执行下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });
  
  // 点击每个商品 a 实现跳转 因为a 是动态渲染的 所有通过事件委托绑定 tap事件
  $('.lt_product').on('tap','a',function(){
    //  获取点击的商品的id
    var id = $(this).data('id')
    // 页面跳转
    location.href = 'product.html?productId=' + id 
  })



});
