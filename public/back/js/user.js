$(function() {
  var currentPage = 1; //当前页
  var pageSize = 5; //每页条数
  var currentId; // 当前用户点击的id
  var isDelete;

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("tpl", info);
        $("tbody").html(htmlStr);

        //  分页初始化
        $("#paginator").bootstrapPaginator({
          // 指定版本
          bootstrapMajorVersion: 3,
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large
          onPageClicked: function(a,b,c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage=page
            render();
          }
        });
      }
    });
  }

  //点击 启用 禁用显示模态框功能
  // 通过事件委托来绑定事件
  $("tbody").on("click", ".btn", function() {
    // 显示模态框
    $("#userModal").modal("show");
    // 点击时获取当前点击项的id  通过data-id自定义属性存在父元素上面
    currentId = $(this)
      .parent()
      .data("id");
    // console.log(currentId);
    //通过类名 来判断点击的是禁用还是启用按钮
    // 1:启用  0：禁用
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    console.log(isDelete);
  });

  // 点击模态框确定按钮
  $("#submitBtn").click(function() {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        if (info.success) {
          // 操作成功，关闭模态框  刷新页面
          $("#userModal").modal("hide");
          render();
        }
      }
    });
  });
});
