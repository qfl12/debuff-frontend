const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置跨域代理，解决前后端分离开发中的跨域问题
  devServer: {
    proxy: {
      // 匹配所有以 '/api' 开头的请求路径
      '/api': {
        target: 'http://localhost:8080', // 后端API的基础路径
        changeOrigin: true, // 允许跨域请求
        pathRewrite: {
          '^/api': '' // 将请求路径中的 '/api' 前缀移除
        }
      }
    }
  }
})
