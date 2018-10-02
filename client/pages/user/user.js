const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    favouriteComments: [],
    submittedComments: [],
    userInfo: null
  },
  onLoad: function (options) {
    this.setData({
      userInfo: app.getUserInfo()
    });
    this.loadFavouriteComments();
    this.loadSubmittedComments();
  },
  loadFavouriteComments: function(success, fail){
    const page = this;
    qcloud.request({
      url: config.service.listFavouriteComments,
      login: true,
      success: function(response){
        page.setData({
          favouriteComments: response.data.data
        });
        success && success();
      },
      fail: function(){
        fail && fail();
      }
    })
  },
  loadSubmittedComments: function (success, fail) {
    const page = this;
    qcloud.request({
      url: config.service.listUserComments,
      login: true,
      success: function (response) {
        page.setData({
          submittedComments: response.data.data
        });
        success && success();
      },
      fail: function () {
        fail && fail();
      }
    })
  },
  onTapLoginButton: function (response) {
    wx.showLoading({
      title: '正在登录'
    });

    const page = this;
    app.onTapLoginButton(response, function () {
      page.setData({
        userInfo: app.getUserInfo()
      });
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      page.onTapAddComment();
    }, function () {
      wx.hideLoading();
    });
  },
  onPullDownRefresh: function () {

  },
  onTapNavigateToIndex: function(){
    wx.navigateBack(); // user page can only be opened from index page
  },
  onTapCommentView: function(event){
    const sourceType = event.currentTarget.dataset.type;
    const index = event.currentTarget.dataset.index;

    var comment;
    if(sourceType == 1){
      comment = this.data.favouriteComments[index];
    }else{
      comment = this.data.submittedComments[index];
    }
    const commentJson = JSON.stringify(comment);

    wx.navigateTo({
      url: `/pages/comment_detail/comment_detail?mode=${comment.type}&movieId=${comment.movieId}&movieTitle=${comment.title}&movieImage=${comment.image}&comment=${commentJson}`
    });
  }
});