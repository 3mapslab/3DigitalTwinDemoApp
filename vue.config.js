module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.resolve.alias.set('@triedeti/threedigitaltwin', '@triedeti/threedigitaltwin-dev');
    }
  },
  devServer: {
    disableHostCheck: true,
    host: 'localhost',
    port: 8080,
},
}