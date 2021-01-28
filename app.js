//app.js
App({
  onLaunch: function() {
    // wx.setStorageSync('multiArray', this.data.multiArray);
    wx.setStorageSync('objectMultiArray', this.data.objectMultiArray);

    this.onGetSysInfo();
    this.getPjContent();
    // 获取学生信息
    this.getStus();
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    isIphoneX: false
  },
  getStus(){
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
  onGetSysInfo() {
    // 先缓存获取
    let isiPhoneX = wx.getStorageSync('isiPhoneX') || false
    // 缓存没有 再获取
    if (!isiPhoneX) {
      wx.getSystemInfo({
        success: res => {
          // 手机品牌
          let modelmes = res.model;
          // 如果是 X,XS,XR,XS MAX,11均可适配
          if (modelmes.indexOf('iPhone X') != -1 || modelmes.indexOf('iPhone 11') != -1 ||
            modelmes.indexOf('iPhone 11 Pro') != -1 || modelmes.indexOf('iPhone 11 Pro Max') != -1) {
            // 存储型号
            this.globalData.isiPhoneX = true
            wx.setStorageSync('isiPhoneX', true)
            // 加入回调
            this.sysCallback && this.sysCallback()
          }
        },
      })
    } else {
      this.globalData.isiPhoneX = isiPhoneX
    }
  },
  getPjContent: function(){
    wx.request({
      url: `http://127.0.0.1:3000/getPjContent`,
      method: 'GET',
      success: res => {
        wx.setStorageSync('pjContent', res.data);
      }
    })
  },
  data: {
    multiArray: [
      ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      ['1班', '2班', '3班', '4班'],
      ['语文', '数学', '英语', '体育']
    ],
    objectMultiArray: [
      [{
          id: 0,
          name: '一年级'
        },
        {
          id: 1,
          name: '二年级'
        },
        {
          id: 2,
          name: '三年级'
        },
        {
          id: 3,
          name: '四年级'
        },
        {
          id: 4,
          name: '五年级'
        },
        {
          id: 5,
          name: '六年级'
        }
      ],
      [{
          id: 0,
          name: '1班'
        },
        {
          id: 1,
          name: '2班'
        },
        {
          id: 2,
          name: '3班'
        },
        {
          id: 3,
          name: '4班'
        }
      ],
      [{
          id: 1,
          name: '语文'
        },
        {
          id: 2,
          name: '数学'
        },
        {
          id: 3,
          name: '英语'
        },
        {
          id: 4,
          name: '体育'
        }
      ]
    ]
  }
})