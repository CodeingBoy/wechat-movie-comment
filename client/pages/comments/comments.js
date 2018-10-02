const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  data: {
    comments: []
  },
  onLoad: function(options) {
    this.loadComments(options.id);
  },
  loadComments: function(id) {
    wx.showLoading({
      title: '加载评论中',
    });

    const page = this;
    qcloud.request({
      url: config.service.listMovieComments,
      data: {
        movieId: id
      },
      success: function(response) {
        page.setData({
          comments: response.data.data
        });
        wx.hideLoading();
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: '评论加载失败，请稍候再试',
          icon: 'none'
        });
        wx.navigateBack();
      }
    })
  },
  onTapNavigateToIndex: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
});