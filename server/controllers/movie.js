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
  }
};