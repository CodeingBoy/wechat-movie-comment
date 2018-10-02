/**
 * 小程序配置文件
 */

const secret = require('./secret.js');

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = secret.getQcloudHost();

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // 获取电影列表
        listMovies: `${host}/weapp/movies`,

        // 获取一部电影,
        getMovie: `${host}/weapp/movies/`,

        // 随机获取一部电影,
        getRandomMovie: `${host}/weapp/movies/random`,

        // 获取一部电影的评论
        listMovieComments: `${host}/weapp/comments`,

        // 添加评论
        addComment: `${host}/weapp/comments`
    }
};

module.exports = config;
