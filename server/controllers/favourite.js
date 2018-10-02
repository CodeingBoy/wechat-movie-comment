const db = require('../utils/db.js');

module.exports = {
  list: async ctx => {
    const openId = ctx.state.$wxInfo.userinfo.openId;
    var comments = await db.query("SELECT c.* FROM favourite_comment AS f JOIN comment_info AS c WHERE s.open_id = ?", [movieId]);

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
  add: async ctx => {
    const openId = ctx.state.$wxInfo.userinfo.openId;
    const commentId = ctx.request.body.commentId;

    var favourited = await db.query("SELECT 1 FROM favourite_comment WHERE open_id = ? AND comment_id = ?", [openId, commentId]);

    if (favourited.length == 0) {
      await db.query("INSERT INTO favourite_comment(open_id, comment_id) VALUES(?, ?)", [openId, commentId]);
    }
  }
};