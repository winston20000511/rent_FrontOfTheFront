module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: process.env.VITE_APIURL, // 后端 API 地址
          changeOrigin: true,
          pathRewrite: { '^/api': '' }, // 可选：重写路径
        },
      },
    },
  };