CREATE TABLE favourite_comment(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'id',
    open_id VARCHAR(100) NOT NULL COMMENT 'open id',
    comment_id BIGINT NOT NULL COMMENT '评论 ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment_info(
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'id',
    open_id VARCHAR(100) NOT NULL COMMENT 'open id',
    movie_id BIGINT NOT NULL COMMENT '电影 id',
    nickname VARCHAR(100) NOT NULL COMMENT '用户昵称',
    avatar_url TEXT NOT NULL COMMENT '用户头像地址',
    content TEXT NOT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4;