const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  data: {
    comments: [],
    movie: {}
  },
  onLoad: function(options) {
    this.loadComments(options.id);
    this.loadMovie(options.id);
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
  loadMovie: function (id) {
    const page = this;
    qcloud.request({
      url: config.service.getMovie + id,
      success: function (response) {
        page.setData({
          movie: response.data.data
        });
      },
      fail: function () {
        wx.showToast({
          title: '加载电影数据失败',
          icon: 'none'
        });
      }
    });
  },
  onTapNavigateToIndex: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  onTapComment: function(event){
    const index = event.currentTarget.dataset.index;
    const comment = this.data.comments[index];
    const commentJson = JSON.stringify(comment);

    wx.navigateTo({
      url: `/pages/comment_detail/comment_detail?mode=${comment.type}&movieId=${this.data.movie.id}&movieTitle=${this.data.movie.title}&movieImage=${this.data.movie.image}&comment=${commentJson}`
    });
  }
});