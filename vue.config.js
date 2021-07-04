module.exports = {
    chainWebpack: config => {
      config.module
        .rule('ignore')
        .test(/\.xcf$/)
        .use('ignore-loader')
          .loader('ignore-loader')
          .end()
    }
  }
  