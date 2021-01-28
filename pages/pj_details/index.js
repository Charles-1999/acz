// pages/pj_details/index.js
import {getCurrentPageUrlWithArgs} from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stus: wx.getStorageSync('stus'),
    stuInfo: {},
    data: [],
    pjContent: [],
    starSrcArr: ['../../icons/stars/star0.png', '../../icons/stars/star1.png', '../../icons/stars/star2.png', '../../icons/stars/star3.png', '../../icons/stars/star4.png', '../../icons/stars/star5.png'],
  },
  getData: function(){
    let that = this;
    wx.request({
      url: `http://127.0.0.1:3000/getPj?stuNo=${this.data.stuInfo.stuNo}`,
      method: 'GET',
      success:(res) => {
        this.setData({
          data: res.data
        },this.countStar)
      }
    })
  },
  countStar: function(){
    let {pjContent} = this.data;
    let {data} = this.data;
    pjContent.forEach((v,i)=>{
      v.starNum = data[i].stars;
      v.starSrc = this.data.starSrcArr[v.starNum];
    })
    this.setData({
      pjContent
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const url = getCurrentPageUrlWithArgs();
    const stuNo = url.slice(30);
    const {stus} = this.data;
    let {stuInfo} = this.data;
    const pjContent = wx.getStorageSync('pjContent');
    stus.some(v => {
      if(v.stuNo == stuNo){
        stuInfo = v;
        return true;
      }
    })
    this.setData({
      stuInfo,
      pjContent
    })
    this.getData()
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