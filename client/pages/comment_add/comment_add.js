const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  data: {
    id: null,
    mode: 1, // 1-文字，2-语音
    movie: {}
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
      }
    });
  },
  onSubmit: function(event) {
    const form = event.detail.value;

    var result = {};
    if (this.data.mode === 1) {
      wx.navigateTo({
        url: `/pages/comment_preview/comment_preview?mode=${this.data.mode}&movieId=${this.data.movie.id}&movieTitle=${this.data.movie.title}&movieImage=${this.data.movie.image}&content=${form.content}`
      });
    } else {

    }
  }

});