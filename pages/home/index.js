// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[
      {
        id:1,
        content: "A"
      },{
        id:2,
        content: "B"
      }, {
        id: 3,
        content: "C"
      }
    ],
    item:[{
      id:1,
      className: "icon-iconcopy",
      title: "学生信息",
      url: "/pages/stuInfo/index",
      icon: "/icons/info.png"
    },{
      id:2,
      className: "icon-unie61e",
      title: "评价系统",
      url: "/pages/pj/index",
      icon: "/icons/pj.png"
    },{
      id:3,
      className: "icon-xinxi",
      title: "通知系统",
      icon: "/icons/message.png"
    },{
      id:4,
      className: "icon-kaoqin",
      title: "考勤管理",
      icon: "/icons/kaoqin.png",
      url: "/pages/kaoqin/index",
    },{
      id:5,
      className: "icon-chengji",
      title: "成绩系统",
      icon: "/icons/grade.png"
    },{
      id:6,
      className: "icon-fenzu",
      title: "排行榜",
      icon: "/icons/rank.png"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})