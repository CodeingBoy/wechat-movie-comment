const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    mode: 1, // 1-文字，2-语音
    movie: {},
    comment: {},
    userInfo: null,
    isReplaying: false,
    commentExists: null,
    userCommentId: null
  },
  onLoad: function(options) {
    this.setData({
      mode: Number(options.mode) || 1,
      movie: {
        id: options.movieId,
        title: options.movieTitle,
        image: options.movieImage
      },
      comment: JSON.parse(options.comment),
      userInfo: app.getUserInfo()
    });
    if (this.data.userInfo) { // needs login
      this.determineCommentExists(this.data.movie.id);
    }
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
    });
  },
  onTapReplayVoiceButton: function() {
    if (this.data.isReplaying) {
      return;
    }

    const page = this;
    const context = app.replayAudio(this.data.comment.content.voice, function() {
      page.setData({
        isReplaying: true
      });
    }, function() {
      page.setData({
        isReplaying: false
      });
    });
  },
  determineCommentExists: function(id, callback) {
    if (this.data.commentExists) {
      // determined, needn't request
      return;
    }

    const page = this;
    qcloud.request({
      url: config.service.determineCommentExists(id),
      login: true,
      success: function(response) {
        page.setData({
          commentExists: response.data.data > 0,
          userCommentId: response.data.data
        });
        callback && callback();
      },
      fail: function() {
        // just assume it doesn't exists
        page.setData({
          commentExists: false
        });
        callback && callback();
      },
    })
  },
  onTapNavigateToMyComment: function() {
    wx.showLoading({
      title: '正在加载影评'
    });

    const page = this;
    qcloud.request({
      url: config.service.getComment + this.data.userCommentId,
      success: function(response) {
        wx.hideLoading();

        const comment = response.data.data;
        const commentJson = JSON.stringify(comment);
        wx.navigateTo({
          url: `/pages/comment_detail/comment_detail?mode=${comment.type}&movieId=${page.data.movie.id}&movieTitle=${page.data.movie.title}&movieImage=${page.data.movie.image}&comment=${commentJson}`
        });
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: '加载影评失败'
        });
      }
    });
  }
});