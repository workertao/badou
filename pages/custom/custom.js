// pages/custom/custom.js
// var parsexml = require("../../utils/parsxml.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topDataArr: [],
    leftDataArr: [],
    centerDataArr: [],
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //调取接口拉去制作资源
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 自定义的方法代码 开始
   */
  /**
   * 获取制作素材数据
   */
  getData: function() {
    this.setData({
      loadingHidden: false
    })
    var salf = this;
    wx.request({
      url: 'https://www.doutula.com/maker',
      data: '',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        //获取json中的xml
        // console.log("成功" + res.data);
        salf.parseData(res.data)
        salf.setData({
          loadingHidden: true,
          isRefresh: false
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
  updateData: function(cate1) {
    this.setData({
      loadingHidden: false
    })
    var salf = this;
    wx.request({
      url: 'https://www.doutula.com/maker/material?cate1=' + cate1,
      data: '',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        //获取json中的xml
        console.log("成功：" + JSON.stringify(res.data));
        var jsonData = JSON.stringify(res.data);
        var newJsonData = jsonData.replace('//static', 'https://www');
        console.log("替换字符串" + newJsonData);
        var jsonObject = JSON.parse(newJsonData)
        console.log("转换object" + jsonObject);
        salf.setData({
          leftDataArr: jsonObject.categories,
          centerDataArr: jsonObject.materials,
          loadingHidden: true,
          isRefresh: false
        })
        console.log("最终数据：" + salf.data.centerDataArr);
      },
      fail: function(res) {
        console.log("失败：" + res.statusCode);
      },
      complete: function(res) {
        console.log("完成：" + res.statusCode);
      },
    })
  },


  //解析数据
  parseData: function(data) {
    var parser = require("../../lib/dom-parser.js")
    var xmlParser = new parser.DOMParser()
    var doc = xmlParser.parseFromString(data)
    //获取所有的<li>标签的属性
    var dataArr = new Array()
    dataArr = doc.getElementsByTagName("li")
    // var dataLeftArr = new Array()
    // dataLeftArr = doc.getElementsByTagName("a")
    //获取头部的类型
    var topArr = new Array();
    //获取左侧的类型
    var leftArr = new Array();
    for (var i = 0; i < dataArr.length; i++) {
      var topDataItem = dataArr[i].getAttribute("data-cate1")
      if (topDataItem) {
        topArr.push(topDataItem);
      }
    }
    // for (var i = 0; i < dataLeftArr.length; i++) {
    //   var leftDataItem = dataLeftArr[i].getAttribute("data-cate2")
    //   leftArr.push(leftDataItem);
    // }
    this.data.topDataArr = this.data.topDataArr.concat(topArr);
    // this.data.leftDataArr = this.data.leftDataArr.concat(leftArr);
    this.setData({
      topDataArr: this.data.topDataArr,
      // leftDataArr: this.data.leftDataArr,
    })
    console.log("数据：" + this.data.topDataArr)
  },

  onTopClick: function(e) {
    var value = e.currentTarget.dataset.topvalue;
    this.updateData(value)
  },
  onLeftClick: function(e) {

  },
  onCenterClick: function(e) {

  },

})