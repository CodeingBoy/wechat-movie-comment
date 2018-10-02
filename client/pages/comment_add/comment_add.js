const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const recordManager = wx.getRecorderManager();
const app = getApp();

Page({
  data: {
    id: null,
    mode: 1, // 1-文字，2-语音
    movie: {},
    content: '',
    voiceFilePath: '',
    isRecording: false,
    isReplaying: false,
    canSubmit: false
  },
  onLoad: function(options) {
    this.setData({
      mode: Number(options.mode) || 1,
      movie: {
        id: options.movieId,
        title: options.movieTitle,
        image: options.movieImage
      },
      content: options.content || '',
      voiceFilePath: options.voice || '',
      canSubmit: options.content || options.voice || false
    });

    // initial record manager
    recordManager.onStop(this.onRecordStop);
  },
  onSubmit: function(event) {
    const form = event.detail.value;

    var result = {};
    if (this.data.mode === 1) {
      wx.redirectTo({
        url: `/pages/comment_preview/comment_preview?mode=${this.data.mode}&movieId=${this.data.movie.id}&movieTitle=${this.data.movie.title}&movieImage=${this.data.movie.image}&content=${form.content}`
      });
    } else {
      const voiceFilePath = encodeURIComponent(this.data.voiceFilePath);
      wx.redirectTo({
        url: `/pages/comment_preview/comment_preview?mode=${this.data.mode}&movieId=${this.data.movie.id}&movieTitle=${this.data.movie.title}&movieImage=${this.data.movie.image}&voice=${voiceFilePath}`
      });
    }
  },
  onTapStartRecordingButton: function() {
    this.setData({
      isRecording: !this.data.isRecording
    });
    recordManager.start();
  },
  onTapStopRecordingButton: function() {
    this.setData({
      isRecording: !this.data.isRecording
    });
    recordManager.stop();
  },
  onTapReplayButton: function() {
    const page = this;

    app.replayAudio(this.data.voiceFilePath, function() {
      page.setData({
        isReplaying: true
      });
    }, function() {
      page.setData({
        isReplaying: false
      });
    });
  },
  onRecordStop: function(response) {
    const voiceFilePath = response.tempFilePath;
    this.setData({
      voiceFilePath,
      canSubmit: true
    });
  },
  onInput: function(event){
    this.setData({
      canSubmit: Boolean(event.detail.value)
    });
  }
});