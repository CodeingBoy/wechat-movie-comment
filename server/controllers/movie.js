const db = require('../utils/db.js');

module.exports = {
  list: async ctx => {
    ctx.state.data = await db.query("SELECT * FROM movies");
  },
  getRandom: async ctx => {
    var movies = await db.query("SELECT * FROM movies");
    const movieCount = movies.length;
    const selectedIndex = Math.floor(Math.random() * movieCount);
    ctx.state.data = movies[selectedIndex];
  },
  get: async ctx => {
    const id = ctx.params.id;

    var movies = await db.query("SELECT * FROM movies WHERE id = ?", [id]);
    if (movies) {
      ctx.state.data = movies[0];
    } else {
      ctx.state.data = {};
    }
  }
};