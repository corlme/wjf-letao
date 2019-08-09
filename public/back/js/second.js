$(function() {
  var currentPage = 1;
  var pageSize = 5;
  // 1.发请求 请求后台列表数据
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);

        var htmlStr = template("secondTpl", info);
        $("tbody").html(htmlStr);

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          size: "small",
          onPageClicked: function(a, b, c, page) {
            currentPage = page;
            render();
          }
        });
      }
    });
  }

  //2. 添加分类模态框
  $("#addBtn").click(function() {
    // 显示模态框
    $("#addModal").modal("show");
    // 发送ajax请求一级分类列表数据
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        console.log(info);

        var htmlStr = template("tpl", info);
        $("ul").html(htmlStr);
      }
    });
  });

  // 3.通过事件委托给ul 下面所有的a绑定点击事件
  $(".dropdown-menu").on("click", "a", function() {
    // 获取a的文本
    var txt = $(this).text();
    // 把文本赋值给ul里面span的文本
    $("#dropdownText").html(txt);
    // 获取到a的id
    var id = $(this).data('id')
    // 把id赋值给input
    $('[name="categoryId"]').val(id)
  });

  // 4.文件上传初始化 利用 jquery-file-upload插件来完成
  $("#fileupload").fileupload({
    // 配置返回的数据格式
    dataType: "json",
    // 配置图片上传后会调用的done回调函数
    done: function(e, data) {
      console.log(data);
      var imgUrl = data.result.picAddr;
      // attr():设置或者返回选择元素的属性和属性值  attribute(属性)的简写
      // atrt(属性名)：返回被选元素的值
      // attr(attribute,value) 设置元素的属性和属性值
      $("#imgBox img").attr("src", imgUrl);
      
      $('[name="brandLogo"]').val(imgUrl)
    }
  });


  // 5.实现表单校验
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
      // 我们需要对隐藏域进行校验 所以不需要将隐藏域排除到校验范围外 所以设置为 空
      excluded:[],
      //配置图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',  //校验成功  valid：有效的
        invalid: 'glyphicon glyphicon-remove',   // 校验失败 invalid:无效
        validating: 'glyphicon glyphicon-refresh'  //validating:校验中
      },

      // 配置字段
      fields:{
        // 字段名称
        categoryId:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:'请选择一级分类'
            }
          }
        },
        brandName:{
          validators:{
            notEmpty:{
              message:'请输入二级分类'
            }
          }
        },
        brandLogo:{
          validators:{
            notEmpty:{
              message:'请上传图片'
            }
          }
        }
      }

  })


  // 6.给表单注册校验成功事件(也就等同于给'确定'按钮绑定点击事件)
  $('#form').on('success.form.bv',function(e){
    // 阻止表单的默认提交
    e.preventDefault()

    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data: $('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        // 1.提交成功 关闭模态框  
        $('#addModal').modal('hide')
        // 2.刷新页面
         currentPage = 1   // 刷新后显示第一页数据
        render()
        // 3.重置表单样式 文本
        $('#form').data('bootstrapValidator').resetForm(true)
        // 4.手动重置文本和图片路劲
        $('#dropdownText').text('请选择一级分类')
        // attr() 设置属性和属性值
        $('#imgBox img').attr('src','images/none.png')
        
      }
    })
  })
  





});
