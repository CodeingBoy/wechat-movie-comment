const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  data: {
    movieInfo: null
  },
  onLoad: function(options) {
    this.loadRandomMovieData();
  },
  loadRandomMovieData: function() {
    wx.showLoading({
      title: '获取电影中'
    });
    const onCompleteLoading = function() {
      wx.hideLoading();
    };

    const page = this;
    qcloud.request({
      url: config.service.getRandomMovie,
      success: function(response) {
        page.setData({
          movieInfo: response.data.data
        });
        onCompleteLoading();
      },
      fail: function() {
        onCompleteLoading();
        wx.showToast({
          title: '加载电影数据失败',
          icon: 'none'
        });
      }
    });
  }
})