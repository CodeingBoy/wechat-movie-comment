const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    mode: 1, // 1-文字，2-语音
    movie: {},
    comment: {},
    userInfo: null
  },
  onLoad: function(options) {
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
      comment: JSON.parse(options.comment),
      userInfo: app.getUserInfo()
    });

  },
  onTapAddComment: function() {
    const page = this;
    wx.showActionSheet({
      itemList: ['文字', '语音'],
      success: function(result) {
        wx.navigateTo({
          url: `/pages/comment_add/comment_add?mode=${result.tapIndex + 1}&movieId=${page.data.movie.id}&movieTitle=${page.data.movie.title}&movieImage=${page.data.movie.image}`
        });
      }
    });
  },
  login: function(response, success) {
    wx.showLoading({
      title: '正在登录'
    });

    const page = this;
    app.onTapLoginButton(response, function() {
      page.setData({
        userInfo: app.getUserInfo()
      });
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      typeof success === 'function' && success();
    }, function() {
      wx.hideLoading();
    });
  },
  onTapLoginButton: function(response) {
    const page = this;
    this.login(response, function() {
      page.onTapAddComment();
    });
  },
  onTapLoginToFavouriteButton: function(response) {
    const page = this;
    this.login(response, function() {
      page.onTapAddFavouriteButton();
    });
  },
  onTapAddFavouriteButton: function() {
    wx.showLoading({
      title: '正在收藏评论'
    });

    const commentId = this.data.comment.id;

    qcloud.request({
      url: config.service.addFavouriteComment,
      method: 'POST',
      login: true,
      data: {
        commentId
      },
      success: function() {
        wx.hideLoading();
        wx.showToast({
          title: '收藏评论成功',
          icon: 'success'
        });
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: '收藏评论失败，请稍候再试',
          icon: 'none'
        });
      }
    })
  }
});