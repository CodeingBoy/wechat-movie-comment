const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  data: {
    comments: [],
    movie: {},
    id: null
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    wx.startPullDownRefresh();
  },
  onPullDownRefresh: function() {
    var promise1 = new Promise((resolve) => {
      this.loadComments(this.data.id, function() {
        resolve();
      });
    });
    var promise2 = new Promise((resolve) => {
      this.loadMovie(this.data.id, function() {
        resolve();
      });
    });
    Promise.all([promise1, promise2]).then(function() {
      wx.stopPullDownRefresh();
    });
  },
  loadComments: function(id, callback) {
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
        // trim comments
        var comments = response.data.data;
        comments.forEach(function(c) {
          if (c.content.type == 1) {
            if (c.content.content.length > 100) {
              c.content.trimmedContent = c.content.content.substr(0, 100) + '...';
            } else {
              c.content.trimmedContent = c.content.content;
            }
          }
        });

        page.setData({
          comments
        });
        wx.hideLoading();
        callback && callback();
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: '评论加载失败，请稍候再试',
          icon: 'none'
        });
        callback && callback();
        wx.navigateBack();
      }
    })
  },
  loadMovie: function(id, callback) {
    const page = this;
    qcloud.request({
      url: config.service.getMovie + id,
      success: function(response) {
        page.setData({
          movie: response.data.data
        });
        callback && callback();
      },
      fail: function() {
        wx.showToast({
          title: '加载电影数据失败',
          icon: 'none'
        });
        callback && callback();
      }
    });
  },
  onTapNavigateToIndex: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  onTapComment: function(event) {
    const index = event.currentTarget.dataset.index;
    const comment = this.data.comments[index];
    const commentJson = JSON.stringify(comment);

    wx.navigateTo({
      url: `/pages/comment_detail/comment_detail?mode=${comment.type}&movieId=${this.data.movie.id}&movieTitle=${this.data.movie.title}&movieImage=${this.data.movie.image}&comment=${commentJson}`
    });
  }
});