$(function() {
  // 获取地址栏参数 调用已经封装好的方法
  var key = getSearchUrlParams("key");
  console.log(key);
  $(".search_input").val(key);

  // 获取到input框的值后 请求数据进行渲染
  render();
  function render() {
    // 三个必传的参数
    var params = {};
    params.proName = $(".search_input").val(); //搜索关键字
    params.page = 1;
    params.pageSize = 100;

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
  }

  // 点击搜索 功能
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
});
