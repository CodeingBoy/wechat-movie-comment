/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
  prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const {
  auth: {
    authorizationMiddleware,
    validationMiddleware
  }
} = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

// --- 电影接口 --- //
// GET /movies 获取所有电影
router.get('/movies', controllers.movie.list);
// GET /movies/random 随机获取一部电影
router.get('/movies/random', controllers.movie.getRandom);
// GET /movies/:id 获取电影信息
router.get('/movies/:id', controllers.movie.get);

// --- 评论接口 --- //
// GET /comments 获取一部电影的所有评论
router.get('/comments', controllers.comment.list);
// GET /comments/random 随机获取一部评论及其电影的信息
router.get('/comments/random', controllers.comment.getRandom);
// GET /comments/me 获取用户自己发布的所有评论
router.get('/comments/me', validationMiddleware, controllers.comment.listUserComment);
// GET /comments/:id 获取评论
router.get('/comments/:id', controllers.comment.get);
// GET /comments/:id/exists 是否已有评论
router.get('/comments/:id/exists', validationMiddleware, controllers.comment.hasComment);
// POST /comments 发表评论
router.post('/comments', validationMiddleware, controllers.comment.add);

// --- 收藏接口 --- //
// GET /favourites 获取收藏的所有评论
router.get('/favourites', validationMiddleware, controllers.favourite.list);
// POST /favourites 添加收藏
router.post('/favourites', validationMiddleware, controllers.favourite.add);

module.exports = router;