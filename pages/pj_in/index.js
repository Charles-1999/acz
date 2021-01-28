// pages/pj_in/index.js
const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirst: true,
    isLast: false,
    swiperHeight: '100vh',
    starWidth: 134.0749969482422,
    scrollLeft: 0,
    currentTab: 0,
    checkedList: [],
    currentStu: 0,
    tab: [{
      id: '0',
      title: '课堂表现',
      contentList: []
    },{
      id: '1',
      title: '作业情况',
      contentList: [],
    },{
      id: '2',
      title: '考勤情况',
      contentList: []
    },{
      id: '3',
      title: '品德',
      contentList: []
    },{
      id: '4',
      title: '体育',
      contentList: []
    },{
      id: '5',
      title: '语文',
      contentList: []
    }],
    starSrcArr: ['../../icons/stars/star0.png', '../../icons/stars/star1.png', '../../icons/stars/star2.png', '../../icons/stars/star3.png', '../../icons/stars/star4.png', '../../icons/stars/star5.png'],
  },
  // 点击切换tab栏
  switchNav(e){
    const {index} = e.currentTarget.dataset;
    let {tab} = this.data;
    let {currentTab} = this.data;
    tab.forEach((v,i) => v.id===index?currentTab=i:'')
    this.setData({
      tab,
      currentTab,
    })
    this.setData({
      swiperHeight: this.data.tab[this.data.currentTab].contentList.length * 190 + 150 + 'rpx'
    })
  },
  // swiper-item切换
  switchTab(e){
    this.setData({
      currentTab: e.detail.current,
    })
    this.setData({
      swiperHeight: this.data.tab[this.data.currentTab].contentList.length * 190 + 150 + 'rpx'
    })
  },
  // 评星
  moveFun(e){
    const {index} = e.currentTarget.dataset;
    const {currentTab} = this.data;
    let touchX = e.changedTouches[0].clientX;
    const targetLeft = e.target.offsetLeft;
    const innerX = touchX - targetLeft;
    let {starWidth} = this.data;
    let starNum = 0;
    starWidth /= 5;
    if(innerX >= starWidth * 4){
      starNum = 5;
    }else if (innerX >= starWidth * 3){
      starNum = 4;
    } else if (innerX >= starWidth * 2) {
      starNum = 3;
    } else if (innerX >= starWidth * 1) {
      starNum = 2;
    }else {
      starNum = 1;
    }
    let {tab} = this.data;
    let {contentList} = tab[currentTab];
    contentList[index].starNum = starNum;
    contentList[index].starSrc = this.data.starSrcArr[starNum];
    this.setData({
      tab
    })
  },
  // 保存按钮事件
  save(e){
    let {checkedList} = this.data;
    let {tab} = this.data;
    let {currentStu} = this.data;
    const curStuNo = checkedList[currentStu].sNo;
    // 学生评价表
    let pjList = [];
    if(wx.getStorageSync('pjList')){
      pjList = wx.getStorageSync('pjList');
    }
    let pj = [];
    // 当前学生在pjList中的索引
    let index = pjList.findIndex(v=> v.sNo == curStuNo);
    if(index == -1 && pjList.length == 0){
      index = 0;
    }else if(index == -1 && pjList.length != 0){
      index = pjList.length;
    }
    tab.forEach(val => {
      val.contentList.forEach(v => {
        pj.push({id: v.id,stars: v.starNum});
      })
    })
    pjList[index] = {
      sNo: curStuNo,
      pj: pj
    }
    wx.setStorageSync('pjList', pjList)
  },
  // 提交按钮事件
  submit(e){
    this.save();
    let pjList = wx.getStorageSync('pjList');
    pjList.forEach(val=>{
      val.pj.forEach(v=>{
        wx.request({
          url: `http://127.0.0.1:3000/inPj?subject='语文'&week=1&stuNo=${val.sNo}&contentId=${v.id}&stars=${v.stars}`,
          method: 'GET',
          success: ()=>{}
        })
      })
    })
  },
  // 初始化显示星星
  showStar(){
    // 根据当前学生的评分来更改contentList里面对应的starNum
    let {checkedList} = this.data;
    let {tab} = this.data;
    let {currentStu} = this.data;
    const curStuNo = checkedList[currentStu].sNo;
    // 学生评价表
    let pjList = [];
    if(wx.getStorageSync('pjList')){
      pjList = wx.getStorageSync('pjList');
    }
    // 当前学生在pjList中的索引
    let index = pjList.findIndex(v=> v.sNo == curStuNo);
    tab.forEach(val => {
      val.contentList.forEach(v => {
        if(index != -1){
          // 评价内容的序号
          let i = pjList[index].pj.findIndex(value => value.id == v.id);
          v.starNum = pjList[index].pj[i].stars;
        }else {
          v.starNum = 0;
        }
        v.starSrc = this.data.starSrcArr[v.starNum];
      })
    })
    this.setData({
      tab
    })
  },
  // 下一个学生
  next(){
    let {checkedList} = this.data;
    let {isLast} = this.data;
    let {currentStu} = this.data;
    this.save();
    currentStu += 1;
    if(currentStu == checkedList.length - 1)
      isLast = true
    this.setData({
      currentStu,
      isLast,
      isFirst: false
    })
    this.showStar();
  },
  // 上一个学生
  prev(){
    let {isFirst} = this.data;
    let {currentStu} = this.data;
    this.save();
    currentStu -= 1;
    if(currentStu == 0)
      isFirst = true
    this.setData({
      currentStu,
      isFirst,
      isLast: false
    })
    this.showStar();
  },
  setPjContent: function(){
    let {tab} = this.data;
    const pjContent = wx.getStorageSync('pjContent');
    pjContent.forEach(v => {
      let idStart = v.id.slice(0,1);
      let data = v;
      data.starSrc = '../../icons/stars/star3.png';
      data.starNum = 0;
      tab[idStart].contentList.push(data);
    })
    console.log(tab)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setPjContent()
    
    const checkedList = wx.getStorageSync('checkedList');
    let isLast;
    if(checkedList.length == 1){
      isLast = true;
    }else {
      isLast = false;
    }
    const app = getApp()
    let isIphoneX = app.globalData.isiPhoneX;
    
    this.setData({
      swiperHeight: this.data.tab[this.data.currentTab].contentList.length * 190 + 150 +'rpx',
      isIphoneX,
      checkedList,
      isLast
    })
    
    this.showStar()
    // var starWidth;
    // wx.createSelectorQuery().select('.star').boundingClientRect(function (rect) {
    //   starWidth = rect.width;
    // }).exec()  
    // setTimeout(() => this.setData({
    //   starWidth
    // }),500)
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