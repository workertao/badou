Page({
  
  //页面的初始数据
  data: {
    imgData:[],
    keyword:"",
    loadingHidden: true,
    pageIndex:1,
    isRefresh:false
  },
  //获取用户输入的关键字
  inputKeyWord: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  //搜索图片
  searchDoutu:function(e){
    var salf = this;
    var input = salf.data.keyword;
    console.log("输入值：" + input)
    if (!input) {
      wx.showToast({
        title: '请输入关键字',
        icon:'none'
      })
      return;
    }
    this.setData({
      loadingHidden: false,
      imgData:[],
      pageIndex:1
    })
    wx.request({
      url: 'https://www.doutula.com/search?keyword=' + input,
      data: '',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        //获取json中的xml
        console.log("成功" + res.data);
        salf.data.pageIndex++;
        salf.onShowImg(res.data);
        salf.setData({
            loadingHidden: true
          })
      },
      fail: function(res) {
        console.log("失败：" + res.statusCode);
      },
      complete: function(res) {
        console.log("完成：" + res.statusCode);
      },
    })
  },
  //上拉加载更多
  searchNextDoutu: function () {
    this.setData({
      loadingHidden: false
    })
    var salf = this;
    var input = salf.data.keyword;
    console.log("输入值：" + input)
    wx.request({
      url: 'https://www.doutula.com/search?type=photo&more=1&page=' + salf.data.pageIndex+'&keyword='+input,
      data: '',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        //获取json中的xml
        // var xml = JSON.stringify(res.data);
        console.log("成功" + res.data);
        salf.data.pageIndex++;
        salf.onShowImg(res.data);
        salf.setData({
          loadingHidden: true,
          isRefresh: false
        })
      },
      fail: function (res) {
        console.log("失败：" + res.statusCode);
      },
      complete: function (res) {
        console.log("完成：" + res.statusCode);
      },
    })
  },

  //解析xml获取图片
  onShowImg:function(data){
    var parser = require("../../lib/dom-parser.js")
    var xmlParser = new parser.DOMParser()
    var doc = xmlParser.parseFromString(data)
    //用来存放所有img节点的集合
    var imgXmlList = new Array();
    imgXmlList = doc.getElementsByTagName("img");
    console.log("图片长度：" + imgXmlList.length);
    //用来存放所有的图片路径集合
    var imgList = new Array();
    for (var i = 0; i < imgXmlList.length;i++){
      var imgPath = imgXmlList[i].getAttribute("data-backup")
      if (imgPath && imgList.indexOf(imgPath)<1){
        imgList.push(imgPath);
        console.log("图片路径：" + i + " " + imgPath);
      }
    }
    this.data.imgData = this.data.imgData.concat(imgList);
    this.setData({
      imgData: this.data.imgData
    })
  },

  //图片点击事件
  onImgClick:function(e){
    var imgPath = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: [imgPath],
      current: imgPath,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload");
    this.onTest();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("是否正在刷新：" + this.data.isRefresh);
    if(this.data.isRefresh){
        return;
    }
    this.setData({
      isRefresh:true
    })
    // 显示加载图标
    console.log("onReachBottom");
    this.searchNextDoutu();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage");
    return{
      title:"acode斗图小程序",
      path:"/pages/index/index",
      imageUrl:'../../image/default.jpg',
      success(e){
        wx.showShareMenu({
          withShareTicket:true
        })
      }
    }
  },

  onTest:function(){
    wx.downloadFile({
      url: 'https://www.doutula.com/material/v10/脸部/真人脸/a70.png',
      success(res) {
        console.log("数据："+res.statusCode)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })
        }
      }
    })


  //   wx.request({
  //     url: 'https://static.doutula.com/material/v10/脸部/真人脸/a70.png',
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/octet-stream',
  //       'User-Agent':'https'
  //     },
  //     success: function (res) {
  //       var data = res.data
  //       console.log("图片："+JSON.stringify(res.data))
  //       console.log(res.statusCode)
  //       if (res.statusCode == 200) {
  //         that.setData({
  //           captchaImage: 'data:image/png;base64,' + data,  // data 为接口返回的base64字符串
  //         })
  //       }
  //     }
  //   })
  }
})