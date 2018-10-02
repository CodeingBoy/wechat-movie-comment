const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    id: null,
    mode: 1, // 1-文字，2-语音
    movie: {},
    userInfo: {},
    content: {},
    voice: {}
  },
  onLoad: function(options) {
    const userInfo = app.getUserInfo();
    if (!userInfo) {
      wx.navigateBack();
      wx.showToast({
        title: '登录后才能发表影评哦',
        icon: 'none'
      });
      return;
    }

    if (!options.mode) {
      options.mode = 1;
    }
    this.setData({
      mode: Number(options.mode),
      movie: {
        id: options.movieId,
        title: options.movieTitle,
        image: options.movieImage
      },
      userInfo
    });
    if (this.data.mode === 1) {
      this.setData({
        content: options.content
      });
    } else {
      this.setData({
        voice: options.voice
      });
    }
  },
  onTapEditButton: function(){
    wx.navigateBack();
  },
  onTapSubmitButton: function(){

  }
});