const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    id: null,
    mode: 1, // 1-文字，2-语音
    movie: {},
    userInfo: {},
    content: {},
    voice: '',
    voiceDuration: 0,
    isReplaying: false
  },
  onLoad: function(options) {
    const userInfo = app.getUserInfo();
    if (!userInfo) {
      wx.navigateBack();
      wx.showToast({
        title: '登录后才能发表影评哦',
        icon: 'none'
      });
      return;
    }

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
      userInfo
    });
    if (this.data.mode === 1) {
      this.setData({
        content: options.content
      });
    } else {
      const page = this;
      const voicePath = decodeURIComponent(options.voice);
      app.getAudioDuration(voicePath, function(duration) {
        page.setData({
          voice: voicePath,
          voiceDuration: Math.floor(duration)
        });
      });
    }
  },
  onTapEditButton: function() {
    wx.redirectTo({
      url: `/pages/comment_add/comment_add?mode=${this.data.mode}&movieId=${this.data.movie.id}&movieTitle=${this.data.movie.title}&movieImage=${this.data.movie.image}&content=${this.data.content}&voice=${this.data.voice}`
    });
  },
  onTapSubmitButton: function() {
    wx.showLoading({
      title: '发表评论中'
    });

    const page = this;
    // function for submitting comment
    // this function may be invoked synchronously or asynchronously, see below
    const submitComment = function(content) {
      qcloud.request({
        url: config.service.addComment,
        method: 'POST',
        login: true,
        data: {
          movieId: page.data.movie.id,
          content: JSON.stringify(content)
        },
        success: function() {
          wx.hideLoading();
          wx.showToast({
            title: '发表评论成功',
            icon: 'success'
          });
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/comments/comments?id=' + page.data.movie.id
            });
          }, 1000)
        },
        fail: function() {
          wx.hideLoading();
          wx.showToast({
            title: '发表评论失败，请稍候再试',
            icon: 'none'
          });
        }
      });
    }

    // due to different comment types, submit json instead of actual content
    var content = {
      type: this.data.mode
    };
    if (this.data.mode === 1) {
      content.content = this.data.content;
      submitComment(content); // synchronous
    } else {
      // upload audio
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: this.data.voice,
        name: 'file',
        success: function(response) {
          const data = JSON.parse(response.data);
          content.voice = data.data.imgUrl;
          content.voiceDuration = page.data.voiceDuration;
          submitComment(content); // asynchronous
        },
        fail: function() {
          wx.hideLoading();
          wx.showToast({
            title: '文件上传失败，请稍候再试',
            icon: 'none'
          });
        }
      })
    }
  },
  onTapReplayVoiceButton: function() {
    if (this.data.isReplaying) {
      return;
    }

    const page = this;
    const context = app.replayAudio(this.data.voice, function() {
      page.setData({
        isReplaying: true
      });
    }, function() {
      page.setData({
        isReplaying: false
      });
    });
  }
});