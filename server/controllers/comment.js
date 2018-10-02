const db = require('../utils/db.js');

module.exports = {
  list: async ctx => {
    const movieId = ctx.request.query.movieId;
    ctx.state.data = await db.query("SELECT * FROM comment_info WHERE movie_id = ?", [movieId]);
  },
  getRandom: async ctx => {
    var movies = await db.query("SELECT * FROM comment_info");
    const movieCount = movies.length;
    const selectedIndex = Math.floor(Math.random() * movieCount);
    ctx.state.data = movies[selectedIndex];
  },
  get: async ctx => {
    const id = ctx.params.id;

    var comments = await db.query("SELECT * FROM movies comment_info id = ?", [id]);
    if (comments) {
      ctx.state.data = comments[0];
    } else {
      ctx.state.data = {};
    }
  },
  add: async ctx =>{
    const openId = ctx.state.$wxInfo.userinfo.openId;
    const nickName = ctx.state.$wxInfo.userinfo.nickName;
    const avatarUrl = ctx.state.$wxInfo.userinfo.avatarUrl;
    const movieId = ctx.request.body.movieId;
    const content = ctx.request.body.content;

    await db.query("INSERT INTO comment_info(open_id, movie_id, nickname, avatar_url, content) VALUES(?, ?, ?, ?, ?)", [openId, movieId, nickName, avatarUrl, content]);
  }
};