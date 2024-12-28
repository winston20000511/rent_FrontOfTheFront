module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080', // 后端 API 地址
          changeOrigin: true,
          pathRewrite: { '^/api': '' }, // 可选：重写路径
        },
      },
    },
  };
  