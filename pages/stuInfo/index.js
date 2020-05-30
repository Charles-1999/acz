// pages/stuInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      ['1班', '2班', '3班', '4班']
    ],
    objectMultiArray: [],
    multiIndex: [0, 0],
    stus: []
  },
  // 点击事件
  handleTap: function(e){
    wx.navigateTo({
      url: '../stuDetail/index?id='+e.currentTarget.dataset.no,
    })
  },
  // 选择器改变
  bindMultiPickerChange: function(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  // 选择器列改变
  bindMultiPickerColumnChange: function(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          // 一年级
          case 0:
            data.multiArray[1] = ['1班', '2班', '3班', '4班'];
            break;
          // 二年级
          case 1:
            data.multiArray[1] = ['1班', '2班', '3班'];
            break;
          // 三年级
          case 2:
            data.multiArray[1] = ['1班', '2班', '3班', '4班', '5班'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  getStus:function(){
    let stus = [];
    wx.request({
      url: 'http://192.168.0.115:3000/stus',
      method: 'GET',
      success: function(res){
        stus = res.data;
        wx.setStorageSync('stus', stus);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const stus = wx.getStorageSync('stus');
    this.setData({
      stus
    })
  },
  onPullDownRefresh: function () {
    this.getStus();
    const stus = wx.getStorageSync('stus');
    this.setData({
      stus
    })
    wx.stopPullDownRefresh();
  },
})