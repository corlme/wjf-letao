$(function() {
  var currentPage = 1;
  var pageSize = 5;
  // 定义用来储存已上传图片的数组
  var picArr = []

  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);
        // 分页初始化(利用分页插件完成)
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          size: "small",
          //  配置分页按钮中文
          // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值进行设置文本
          // 参数1: type  取值: page  first  last  prev  next
          // 参数2: page  指当前这个按钮所指向的页码
          // 参数3: current 当前页
          itemTexts: function(type, page, current) {
            switch (type) {
              case "page":
                return page;
              case "first":
                return "第一页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          //  配置title提示信息
          tooltipTitles: function(type, page, current) {
            switch (type) {
              case "page":
                return "前往第" + page + "页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          // 开启bootstrap内置的提示信息组件
          useBootstrapTooltip: true,

          onPageClicked: function(a, b, c, page) {
            // 点击对应页码展示对应页码的数据
            (currentPage = page),
              // 刷新页面
              render();
          }
        });
      }
    });
  }

  // 2.点击添加商品按钮 显示模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");
    // 发请求 获取二级分类数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        console.log(info);

        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });

  //3.给ul下面的a绑定事件委托
  $(".dropdown-menu").on("click", "a", function() {
    // 获取点击的a的文本
    var txt = $(this).text();
    // 把文本赋值给ul框
    $("#dropdownText").text(txt);
    // 获取点击的a的id
    var id = $(this).data("id");
    // css3选择器：[name="brandId"]
    $('[name="brandId"]').val(id);

    // 当选中了二级分类后 手动重置校验状态为 VALID校验成功状态
    $('#form').data("bootstrapValidator").updateStatus('brandId','VALID')
  });

  // 4.文件上传初始化
  $('#fileupload').fileupload({
    dataType:'json',  //返回的数据类型
    // 文件上传完成时调用的函数
    done:function(e,data){
      console.log(data.result);
      var imgUrl = data.result.picAddr
      // $('#imgBox img').attr('src',imgUrl) //设置img的图片地址
     
      // 往数组的最前面追加 图片
      picArr.unshift( data.result )

      // 动态创建img结构 并设置图片属性值
      // prepend():往数组的最前面追加元素
      // append():往数组的最后面添加元素
      $('#imgBox').prepend('<img src="'+ imgUrl +'" width="100">')

      // 最多只能上传3张 如果超多3张 就把数组最后面的一项删掉
      if(picArr.length > 3){
        picArr.pop()  //移除最后一项  pop():数组方法，用于删除数组最后一个元素
        // 还有删除 imgBox中的最后一张图片
        // last-of-type: css3选择器，选中属于父元素的最后一个子元素
        // $('#imgBox img:last-of-type').remove()  //两种方法都可以
        $('#imgBox img').eq(-1);  //eq()选择器：返回带有索引号的元素  eq(-1):从最后一个元素开始计算索引也就是选中了最后一个元素
      }
      if(picArr.length === 3){
        // 正好是3张图片时 手动重置校验状态为 VALID 校验成功状态
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      }
      
    }

  })

  // 5.表单校验初始化
  $("#form").bootstrapValidator({
    // 重置排除项，设置为空 即是 不排除
    //    excluded: 排除，不包括在内
    excluded:[],

    // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',  //校验成功  valid：有效的
            invalid: 'glyphicon glyphicon-remove',   // 校验失败 invalid:无效
            validating: 'glyphicon glyphicon-refresh'  //validating:校验中
        },
        // 配置字段
        fields:{
            // 字段名
            brandId:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请选择二级分类"
                    }
                }
            },

            proName:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请输入商品名称"
                    }
                }
            },
            proDesc:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请输入商品描述"
                    }
                }
            },
            // 商品库存
            num:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请输入商品库存"
                    },
                    //正则校验
                    // \d 表示数字0-9
                    // + 表示出现一次或多次
                    // * 表示出现0次或多次
                    // ？表示出现0次或1次
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            // 商品尺码
            //   除了非空，还要求以 xx-xx 的格式 x为数字
            size:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请输入商品尺码"
                    },
                    // 要求以 xx-xx 的格式 x为数字
                    // \d{2} 表示以数字开头 只有2位数字
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式必须是xx-xx的格式，例如35-40'
                    }
                }
            },
            oldPrice:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请输入商品原价"
                    }
                }
            },
            price:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请输入商品现价"
                    }
                }
            },
            // 图片校验
            picStatus:{
                validators:{
                    notEmpty:{
                        message:"请上传3张图片"
                    }
                }
            }

        }
});


// 注册表单校验成功事件 阻止默认提交 通过ajax
$('#form').on('success.form.bv',function(e){
  e.preventDefault()

  // serialize() 获取的是表单元素的数据 图片数据是不能获取的
  var paramsStr = $('#form').serialize()

  // 所以图片的参数 需要额外拼接到地址栏参数中
      // 还需要拼接上图片的name 和 地址
  // username=123&password=234&picName1=xx&picAddr1=xx&picName2=xx&picAddr2=xx&picName3=xx&picAddr3=xx
       // username=123&password=234
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
    paramsStr += "&picName1="+ picArr[0].picName +"&picAddr1" + picArr[0].picArr;
    paramsStr += "&picName2="+ picArr[0].picName +"&picAddr2" + picArr[0].picArr;
    paramsStr += "&picName3="+ picArr[0].picName +"&picAddr3" + picArr[0].picArr;

  $.ajax({
    type:"post",
    url:"/product/addProduct",
    data: paramsStr,
    dataType:"json",
    success:function(info){
      console.log(info);
      if(info.success){
        // 提交商品成功 关闭模态框
        $('#addModal').modal('hide')
        // 重新渲染页面
        currentPage = 1 // 渲染展示第一页
        render()
        // 重置表单数据
        $('#form').data('bootstrapValidator').resetForm(true)
        // 下拉菜单和图片不是表单数据 需要手动重置
        $('#dropdown-menu').html('请选择二级分类')
        $('#imgBox img').remove()  //移除所有图片
      }
      
    }
  })
})

});
