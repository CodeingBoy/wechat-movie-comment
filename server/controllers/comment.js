const db = require('../utils/db.js');

module.exports = {
  list: async ctx => {
    const movieId = ctx.request.query.movieId;
    var comments = await db.query("SELECT * FROM comment_info WHERE movie_id = ?", [movieId]);

    ctx.state.data = comments.map(function(c) {
      var content = JSON.parse(c.content);

      return {
        avatarUrl: c.avatar_url,
        type: content.type,
        content,
        id: c.id,
        nickname: c.nickname
      };
    })
  },
  listUserComment: async ctx => {
    const openId = ctx.state.$wxInfo.userinfo.openId;
    var comments = await db.query("SELECT c.*, m.id AS movie_id, m.title, m.image FROM comment_info AS c JOIN movies AS m ON c.movie_id = m.id WHERE open_id = ?", [openId]);

    ctx.state.data = comments.map(function(c) {
      var content = JSON.parse(c.content);

      return {
        avatarUrl: c.avatar_url,
        type: content.type,
        content,
        id: c.id,
        nickname: c.nickname,
        title: c.title,
        image: c.image,
        movieId: c.movie_id
      };
    })
  },
  getRandom: async ctx => {
    var movies = await db.query("SELECT c.*, m.id AS movie_id, m.title, m.image FROM comment_info AS c JOIN movies AS m ON c.movie_id = m.id");
    const movieCount = movies.length;
    const selectedIndex = Math.floor(Math.random() * movieCount);

    const c = movies[selectedIndex];
    const content = JSON.parse(c.content);
    const result = {
      avatarUrl: c.avatar_url,
      type: content.type,
      content,
      id: c.id,
      nickname: c.nickname,
      title: c.title,
      image: c.image,
      movieId: c.movie_id
    };
    ctx.state.data = result;
  },
  get: async ctx => {
    const id = ctx.params.id;

    var comments = await db.query("SELECT * FROM comment_info WHERE id = ?", [id]);
    if (comments) {
      ctx.state.data = comments[0];
    } else {
      ctx.state.data = {};
    }
  },
  add: async ctx => {
    const openId = ctx.state.$wxInfo.userinfo.openId;
    const nickName = ctx.state.$wxInfo.userinfo.nickName;
    const avatarUrl = ctx.state.$wxInfo.userinfo.avatarUrl;
    const movieId = ctx.request.body.movieId;
    const content = ctx.request.body.content;

    await db.query("INSERT INTO comment_info(open_id, movie_id, nickname, avatar_url, content) VALUES(?, ?, ?, ?, ?)", [openId, movieId, nickName, avatarUrl, content]);
  }
};