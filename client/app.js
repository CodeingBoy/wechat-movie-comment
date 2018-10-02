//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

var userInfo = null;
var sessionValid = false;

App({
  onLaunch: function() {
    qcloud.setLoginUrl(config.service.loginUrl)
    this.loadSessionUserInfo();
  },
  loadSessionUserInfo: function() {
    const page = this;
    wx.checkSession({
      success: function() {
        page.refreshSessionUserInfo();
        sessionValid = true;
      },
      fail: function() {
        console.log("session invalid");
      }
    })
  },
  refreshSessionUserInfo: function() {
    const userInfoPromise = this.getSessionUserInfo()
      .then(function(info) {
        userInfo = info;
      });
  },
  getSessionUserInfo: function() {
    return new Promise((resolve, reject) => {
      qcloud.request({
        url: config.service.requestUrl,
        login: true,
        success: function(response) {
          resolve(response.data.data);
        },
        fail: function(error) {
          console.log(error);
          reject(new Error(error));
        }
      })
    });
  },
  getUserInfo: function() {
    return userInfo;
  },
  setUserInfo: function(info) {
    userInfo = info;
  },
  onTapLoginButton: function(response, success, fail) {
    const app = this;
    if (response.detail.userInfo) {
      qcloud.login({
        success: function(response) {
          app.setUserInfo(response);

          typeof success === 'function' && success();
        },
        fail: function(err) {
          console.log(err);
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });

          typeof fail === 'function' && fail();
        }
      });
    } else {
      wx.showToast({
        title: '您取消了登录',
        icon: 'none'
      });
      onCompleteLoading();
    }
  },
  replayAudio: function(audioFilePath, onPlay, onEnded) {
    const context = wx.createInnerAudioContext();

    context.src = audioFilePath;
    context.onEnded(function() {
      onEnded && onEnded();
      context.destroy();
    });

    onPlay && onPlay();
    context.play();

    return context;
  },
  getAudioDuration: function(audioFilePath, callback) {
    const context = wx.createInnerAudioContext();
    context.src = audioFilePath;
    context.onCanplay(function(){
      context.duration;
      setTimeout(function () {
        console.log(context.duration);
        callback(context.duration);
        context.destroy();
      }, 1000);
    });
  }
});