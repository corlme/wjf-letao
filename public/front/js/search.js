$(function() {
  // 要渲染历史记录, 要先读取历史记录, 下面都是进行历史记录存取操作
  // 我们需要约定一个键名, search_list

  // 将来下面三句话, 可以放在控制台执行, 进行假数据初始化
  // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ];
  // var jsonStr = JSON.stringify( arr );
  // localStorage.setItem( "search_list", jsonStr );

  // 功能1：历史记录渲染
   render()

  // 封装一个方法，用于读取本地历史记录数据 返回一个数组
  // 1.读取本地历史，得到jsonStr字符串
  // 2.将jsonStr字符串转成数组
  // 3.通过数组，进行页面渲染
  function getHistory () {
    // 如果读取不出来数据，默认是一个空数组，这样渲染的时候就不会因为没有数据而报错
    var history = localStorage.getItem('search_list') || '[]'
    var arr = JSON.parse(history)
    return arr
  }

  // 封装一个方法，专门用于读取本地历史记录，用于渲染
  function render () {
    var arr = getHistory()
    var htmlStr = template('historyTpl',{arr:arr})
    $(".lt_history").html(htmlStr);
  }


  // 功能2：清空历史记录
  // 1.通过事件委托给清空记录按钮绑定点击事件(因为 清空记录按钮 是动态渲染的 所有用事件委托)
  // 2.清空，将本地localStorage中的search_list 移除 removeItem()
  // 3.页面重新渲染
  $('.lt_history').on('click','.btn-empty',function(){
    
    // mui确认框
    // 参数1: 提示文本
    // 参数2: 标题
    // 参数3: 提示框按钮按钮, 要求是一个数组
    // 参数4: 点击按钮后的回调函数
   mui.confirm('你确定清空所有记录吗？','温馨提示', ['取消','确定'],function(e){
     if(e.index === 1) {
      //  index为1 表示点击的确定按钮

      localStorage.removeItem('search_list')   //清空本地历史记录
      // 重新渲染页面
      render()
     }
   })

  })


  // 功能3 删除单条历史记录
  // (1) 事件委托绑定点击事件
  // (2) 将下标存在删除按钮中, 点击后获取下标
  // (3) 读取本地存储, 拿到数组
  // (4) 根据下标, 从数组中将该下标的项移除,  splice
  // (5) 将数组转换成 jsonStr
  // (6) 存到本地存储中
  // (7) 重新渲染
  $('.lt_history').on('click',".btn_del",function(){
    var that = this

    mui.confirm('你确定删除该条记录吗？','温馨提示',['取消','确定'],function(e){
      if(e.index === 1){
      //  点击了确定按钮

        var index = $(that).data('index')  //获取下标
        var arr = getHistory()            //获取历史记录数组
        // 根据下标删除某项 
        arr.splice(index,1)
        // 在存储到本地历史记录中
        localStorage.setItem('search_list', JSON.stringify( arr))
        // 重新渲染
        render()
      }
    })
    
  })


  // 功能4.添加历史记录
  $('.search_btn').click(function(){
    // 点击搜索按钮 获取input框的值
    var key = $('.search_input').val().trim();
    if( key === ''){
      mui.toast('请输入搜索关键字',{
        duration:3000
      })
      return;
    }
    // 获取历史记录数据
    var arr = getHistory()
     
    // 需求：1、不能有重复的 2.长度不能超多10
    var index = arr.indexOf(key)  // 找到key值在数组中对应的下标
    if(index != -1){
      // 说明有重复项 key在数组已存在

      // 根据下标删除该重复项
      arr.splice(index,1)
    }
      //  2.数组长度不超多10
      if(arr.length >= 10){
        // 移除最后一个
        arr.pop()
      }

    // 往数组的最前面添加数据
    arr.unshift( key )
    // 然后转成字符串存储到本地历史记录中
    localStorage.setItem('search_list', JSON.stringify(arr))
    // 页面重新渲染
    render()
    // 清空input框
    $('.search_input').val('');

   //跳转到搜索列表页  并且把搜索关键字通过地址栏传参传过去
   location.href = 'searchList.html?key=' + key;  

  })





});
