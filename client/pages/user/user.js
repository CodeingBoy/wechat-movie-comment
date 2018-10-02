const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    favouriteComments: [],
    submittedComments: [],
    userInfo: null
  },
  onLoad: function(options) {
    wx.startPullDownRefresh();
  },
  loadFavouriteComments: function(success, fail) {
    const page = this;
    qcloud.request({
      url: config.service.listFavouriteComments,
      login: true,
      success: function(response) {
        // trim comments
        var comments = response.data.data;
        comments.forEach(function(c) {
          if (c.content.type == 1 && c.content.content.length > 60) {
            c.content.content = c.content.content.substr(0, 60) + '...';
          }
        });

        page.setData({
          favouriteComments: comments
        });
        success && success();
      },
      fail: function() {
        fail && fail();
      }
    })
  },
  loadSubmittedComments: function(success, fail) {
    const page = this;
    qcloud.request({
      url: config.service.listUserComments,
      login: true,
      success: function(response) {
        // trim comments
        var comments = response.data.data;
        comments.forEach(function(c) {
          if (c.content.type == 1) {
            if (c.content.content.length > 60) {
              c.content.trimmedcontent = c.content.content.substr(0, 60) + '...';
            } else {
              c.content.trimmedcontent = c.content.content;
            }
          }
        });

        page.setData({
          submittedComments: comments
        });
        success && success();
      },
      fail: function() {
        fail && fail();
      }
    })
  },
  onTapLoginButton: function(response) {
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
      page.onTapAddComment();
    }, function() {
      wx.hideLoading();
    });
  },
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '刷新中'
    });

    this.setData({
      userInfo: app.getUserInfo()
    });

    var promise1 = new Promise((resolve) => {
      this.loadFavouriteComments(function() {
          resolve();
        },
        function() {
          resolve();
        });
    });
    var promise2 = new Promise((resolve) => {
      this.loadSubmittedComments(function() {
          resolve();
        },
        function() {
          resolve();
        });
    });
    Promise.all([promise1, promise2]).then(function() {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });
  },
  onTapNavigateToIndex: function() {
    wx.navigateBack(); // user page can only be opened from index page
  },
  onTapCommentView: function(event) {
    const sourceType = event.currentTarget.dataset.type; // 1-favourite, 2-submitted
    const index = event.currentTarget.dataset.index;

    var comment;
    if (sourceType == 1) {
      comment = this.data.favouriteComments[index];
    } else {
      comment = this.data.submittedComments[index];
    }
    const commentJson = JSON.stringify(comment);

    wx.navigateTo({
      url: `/pages/comment_detail/comment_detail?mode=${comment.type}&movieId=${comment.movieId}&movieTitle=${comment.title}&movieImage=${comment.image}&comment=${commentJson}`
    });
  }
});