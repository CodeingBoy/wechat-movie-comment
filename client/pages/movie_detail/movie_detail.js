const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    id: null,
    movie: {},
    userInfo: null
  },
  onLoad: function(options) {
    this.setData({
      id: options.id,
      userInfo: app.getUserInfo()
    });
    this.loadMovie(this.data.id);
    if (this.data.userInfo) { // needs login
      this.determineCommentExists(this.data.id);
    }
  },
  loadMovie: function(id) {
    wx.showLoading({
      title: '获取电影中'
    });
    const onCompleteLoading = function() {
      wx.hideLoading();
    };

    const page = this;
    qcloud.request({
      url: config.service.getMovie + id,
      success: function(response) {
        page.setData({
          movie: response.data.data
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
  },
  onTapMovieImage: function() {
    wx.previewImage({
      urls: [this.data.movie.image]
    });
  },
  onTapShowComments: function() {
    wx.navigateTo({
      url: '/pages/comments/comments?id=' + this.data.id
    });
  },
  onTapAddComment: function() {
    wx.showLoading({
      title: '准备发布影评'
    });

    const page = this;
    this.determineCommentExists(this.data.movie.id, function() {
      wx.hideLoading();

      if (page.data.commentExists) {
        wx.showToast({
          title: '您之前已经发布过影评啦，去发布其它电影的影评吧',
          icon: 'none'
        });
        return;
      }

      wx.showActionSheet({
        itemList: ['文字', '语音'],
        success: function(result) {
          wx.navigateTo({
            url: `/pages/comment_add/comment_add?mode=${result.tapIndex + 1}&movieId=${page.data.movie.id}&movieTitle=${page.data.movie.title}&movieImage=${page.data.movie.image}`
          });
        }
      });
    });
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
  determineCommentExists: function (id, callback) {
    if (this.data.commentExists) {
      // determined, needn't request
      return;
    }

    const page = this;
    qcloud.request({
      url: config.service.determineCommentExists(id),
      login: true,
      success: function (response) {
        page.setData({
          commentExists: response.data.data > 0,
          userCommentId: response.data.data
        });
        callback && callback();
      },
      fail: function () {
        // just assume it doesn't exists
        page.setData({
          commentExists: false
        });
        callback && callback();
      },
    })
  },
  onTapNavigateToMyComment: function () {
    wx.showLoading({
      title: '正在加载影评'
    });

    const page = this;
    qcloud.request({
      url: config.service.getComment + this.data.userCommentId,
      success: function (response) {
        wx.hideLoading();

        const comment = response.data.data;
        const commentJson = JSON.stringify(comment);
        wx.navigateTo({
          url: `/pages/comment_detail/comment_detail?mode=${comment.type}&movieId=${page.data.movie.id}&movieTitle=${page.data.movie.title}&movieImage=${page.data.movie.image}&comment=${commentJson}`
        });
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '加载影评失败'
        });
      }
    });
  }
});