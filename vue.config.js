const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置跨域代理，解决前后端分离开发中的跨域问题
  devServer: {
    host: '0.0.0.0', // 允许局域网访问
    port: 8081, // 避免与后端端口冲突
    proxy: {
      // 匹配所有以 '/api' 开头的请求路径
      '/api': {
          //target: 'http://localhost:8080', // 使用localhost作为后端API的基础路径
          target: 'http://192.168.110.7:8080', // 旧IP配置（已注释）
        ws: true, // 支持WebSocket
        changeOrigin: true, // 允许跨域请求
        pathRewrite: {
          '^/api': '/api' // 保留请求路径中的 '/api' 前缀
        }
      },
      // 代理静态资源请求
      '/assets/avatars': {
        target: 'http://localhost:8080',
        pathRewrite: {'^/assets/avatars': '/static/assets/avatars'},
        ws: true,
        changeOrigin: true
      }

    }
  }
})
