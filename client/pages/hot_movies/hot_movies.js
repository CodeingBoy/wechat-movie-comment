const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  data: {
    movies: []
  },
  onLoad: function (options) {
    wx.startPullDownRefresh();
  },
  onPullDownRefresh: function(){
    this.loadMovies(function(){
      wx.stopPullDownRefresh();
    });
  },
  loadMovies: function (callback) {
    wx.showLoading({
      title: '获取电影中'
    });
    const onCompleteLoading = function () {
      wx.hideLoading();
      callback && callback();
    };

    const page = this;
    qcloud.request({
      url: config.service.listMovies,
      success: function (response) {
        page.setData({
          movies: response.data.data
        });
        onCompleteLoading();
      },
      fail: function () {
        onCompleteLoading();
        wx.showToast({
          title: '加载电影数据失败',
          icon: 'none'
        });
      }
    });
  }
})