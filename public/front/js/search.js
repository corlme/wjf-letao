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
    localStorage.removeItem('search_list')   //清空本地历史记录
    // 重新渲染页面
    render()
  })







});
