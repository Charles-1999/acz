// pages/pj/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    tab: [{
      id: 0,
      value: "学生评价",
      isActive: true,
    }, {
      id: 1,
      value: "查看评价",
      isActive: false,
    }],

    multiArray: [['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], ['1班', '2班', '3班', '4班'], ['语文', '数学', '英语', '体育'],['第1周','第2周','第3周','第4周','第5周','第6周']],
    objectMultiArray: [],
    multiIndex: [0, 0, 0, 0],

    stus: [],
    allChecked:false
  },

  // tab栏切换
  handleTabItemChange(e) {
    const {index} = e.detail;
    // 修改原数组
    let {tab} = this.data;
    tab.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data中
    this.setData({
      tab
    })
  },

  // 选择器改变
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  // 选择器列改变
  bindMultiPickerColumnChange: function (e) {
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
            // 一年级 1班
            data.multiArray[2] = ['语文', '数学', '英语', '体育'];
            break;
            // 二年级
          case 1:
            data.multiArray[1] = ['1班', '2班', '3班'];
            // 二年级 1班
            data.multiArray[2] = ['语文', '数学', '英语'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      // 班级
      case 1:
        switch (data.multiIndex[0]) {
          // 一年级
          case 0:
            switch (data.multiIndex[1]) {
              // 一年级 1班
              case 0:
                data.multiArray[2] = ['语文', '数学', '英语', '体育'];
                break;
              // 一年级 2班
              case 1:
                data.multiArray[2] = ['语文', '数学', '英语', '体育'];
                break;
              // 一年级 3班
              case 2:
                data.multiArray[2] = ['语文', '数学', '英语', '体育'];
                break;
              // 一年级 4班
              case 3:
                data.multiArray[2] = ['语文', '数学', '英语', '体育'];
                break;
            }
            break;
          // 二年级
          case 1:
            switch (data.multiIndex[1]) {
              // 二年级 1班
              case 0:
                data.multiArray[2] = ['语文', '数学', '英语'];
                break;
              // 二年级 2班
              case 1:
                data.multiArray[2] = ['语文', '数学', '英语'];
                break;
              // 二年级 3班
              case 2:
                data.multiArray[2] = ['语文', '数学', '英语'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  },

  // stu中CheckBox改变
  handleCheckedChange(e){
    const {stu_no} = e.currentTarget.dataset;
    let {stus} = this.data;
    let allChecked = true;
    stus.forEach((v,i) => {
      if(v.stuNo === stu_no){ 
        v.checked = !v.checked;
      }
      if(!v.checked) allChecked = false;
    })
    this.setData({
      stus,
      allChecked
    })
  },
  // 全选框改变事件
  handleAllCheckedChange(e){
    this.setData({
      allChecked: !this.data.allChecked
    })
    let {stus} = this.data;
    stus.forEach(v => v.checked = this.data.allChecked)
    this.setData({
      stus
    })
  },
  // 确定按钮事件
  handleConfirm(e){
    let checkedList = [];
    const {stus} = this.data;
    stus.forEach(v => {
      if(v.checked){
        checkedList.push({sNo:v.stuNo,sName:v.stuName})
      }
    })
    wx.setStorageSync('checkedList', checkedList)
    if(checkedList.length == 0){
      wx.showToast({
        title: '请选择要评价的学生',
        icon: 'none'
      })
    }else {
      wx.navigateTo({
        url: '../pj_in/index',
      })
    }
  },
  // 获取stus列表
  getStus:function(){
    let stus = [];
    wx.request({
      url: 'http://127.0.0.1:3000/stus',
      method: 'GET',
      success: function(res){
        stus = res.data;
        wx.setStorageSync('stus', stus);
      }
    })
  },
  // 查看评价详情
  handleTap(e){
    wx.navigateTo({
      url: `../pj_details/index?stuNo=${e.currentTarget.dataset.no}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const app = getApp();
    let isIphoneX = app.globalData.isiPhoneX;

    const objectMultiArray = wx.getStorageSync('objectMultiArray');
    const stus = wx.getStorageSync('stus');
    this.setData({
      isIphoneX,
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