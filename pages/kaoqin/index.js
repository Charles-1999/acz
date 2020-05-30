// pages/kaoqin/index.js
import {formatDate} from "../../utils/util.js"
import {formatTime} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: '',
    stus: [],
    stuState: [],
    stuStateList: [],
    currentDatas: 20,
    currentTab: 0,
    tab: [
      {
        id: 0,
        title: '考勤管理',
      },
      {
        id: 1,
        title: '考勤历史'
      }
    ],
    multiArray: [
      ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      ['1班', '2班', '3班', '4班']
    ],
    objectMultiArray: [],
    multiIndex: [0, 0],
    date: '',
  },
  // 点击切换tab栏
  switchNav(e){
    const {index} = e.currentTarget.dataset;
    let {tab} = this.data;
    let {currentTab} = this.data;
    let swiperHeight;
    tab.forEach((v,i) => v.id===index?currentTab=i:'')
    if(currentTab == 0){
      swiperHeight = this.data.stus.length * 120 +'rpx'
    }else if(currentTab == 1){
      // swiperHeight = (this.data.stuStateList.length + 1) * 90 +'rpx'
      this.getStateList(this.data.date);
    }
    this.setData({
      tab,
      currentTab,
      swiperHeight,
      currentDatas:20
    })
  },
  // swiper-item切换
  switchTab(e){
    const currentTab = e.detail.current;
    let swiperHeight;
    this.setData({
      currentTab,
      currentDatas:20
    })
    if(currentTab == 0){
      swiperHeight = this.data.stus.length * 120 +'rpx'
    }else if(currentTab == 1){
      // swiperHeight = (this.data.stuStateList.length + 1) * 90 +'rpx'
      this.getStateList(this.data.date);
    }
    this.setData({
      swiperHeight
    })
  },
  // 日期选择器改变
  bindDateChange: function(e) {
    const date = e.detail.value
    this.getStateList(date);
    this.setData({
      date,
      currentDatas:20
    })
  },
  // 状态变更事件
  stateChange: function(e){
    const {id} = e.target;
    const {no} = e.currentTarget.dataset;
    let {stus} = this.data;
    let {stuState} = this.data;
    const index = stus.findIndex(v => v.stuNo == no);
    let that = this;
    // 数据库插入数据
    wx.request({
      url: `http://192.168.0.115:3000/inState?state=${id}&no=${no}`,
      method: 'GET',
      success:(res)=> {
      },
      fail: (res) => {
        console.log(res);
      },
    })
    // 数据库获取数据
    wx.request({
      url: `http://192.168.0.115:3000/getState?no=${no}`,
      method: 'GET',
      success: (res) => {
        const i = stuState.findIndex(v => v.stuNo == no);
        if(i == -1){
          stuState.push(res.data);
        }else{
          stuState[i] = res.data
        }
        stus[index].state = res.data.state;
        that.setData({
          stuState,
          stus
        })
      }
    })
  },
  // 获取考勤历史
  getStateList: function(date){
    let nums = this.data.currentDatas;
    let that = this;
    wx.request({
      url: `http://192.168.0.115:3000/getStateList?date=${date}&nums=${nums}`,
      method: 'GET',
      success: (res) => {
        res.data.forEach(v=>{
          if(v.state == 0){
            v.state = '在校'
          }else if(v.state == 1){
            v.state = '离校'
          }else {
            v.state = '请假'
          }
          let time = new Date(v.datetime)
          v.datetime = formatTime(time)
        })
        that.setData({
          stuStateList: res.data,
          swiperHeight: (res.data.length + 1) * 90 +'rpx'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let stus = [];
    let stuState = [];
    let that = this;
    new Promise((resolve, reject) => {
      wx.request({
        url: 'http://192.168.0.115:3000/stus',
        method: "GET",
        success: function(res) {
          // stus = res.data;
          resolve(res.data);
          // that.setData({
          //   stus
          // })
        }
      })
    }).then(res => {
      stus = res;
      res.forEach(v => {
        new Promise((resolve, reject) => {
          wx.request({
            url: `http://192.168.0.115:3000/getState?no=${v.stuNo}`,
            method: "GET",
            success: function(res) {
              resolve(res.data)
            }
          })
        }).then(res=>{
          v.state = res.state
          stuState.push(res)
          let swiperHeight = stus.length * 120 +'rpx'
          that.setData({
            stus,
            stuState,
            swiperHeight
          })
        })
      })
    })  
    var now = new Date();
    now = formatDate(now)
    this.getStateList(now)
    this.setData({
      date: now,
    })
  },
  onReachBottom: function(){
    if(this.data.currentTab == 1){
      let {currentDatas} = this.data;
      if(this.data.stuStateList.length == currentDatas){
        currentDatas += 20;
        this.setData({
          currentDatas,
        })
        this.getStateList(this.data.date)
      }
    }
  }
})