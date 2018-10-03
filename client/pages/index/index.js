const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  data: {
    comment: null
  },
  onLoad: function(options) {
    wx.startPullDownRefresh();
  },
  loadRandomMovieData: function(complete) {
    wx.showLoading({
      title: '获取电影中'
    });
    const onCompleteLoading = function() {
      wx.hideLoading();
      complete && complete();
    };

    const page = this;
    qcloud.request({
      url: config.service.getRandomComment,
      success: function(response) {
        page.setData({
          comment: response.data.data
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
  onPullDownRefresh: function(){
    this.loadRandomMovieData(function(){
      wx.stopPullDownRefresh();
    });
  },
  onTapCommentUser: function(){
    const comment = this.data.comment;
    const commentJson = JSON.stringify(comment);
    wx.navigateTo({
      url: `/pages/comment_detail/comment_detail?mode=${comment.type}&movieId=${comment.movieId}&movieTitle=${comment.title}&movieImage=${comment.image}&comment=${commentJson}`
    });
  },
  onTapMovieImage: function(){
    wx.navigateTo({
      url: '/pages/movie_detail/movie_detail?id=' + this.data.comment.movieId
    });
  }
})