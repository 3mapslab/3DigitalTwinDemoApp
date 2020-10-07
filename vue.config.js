module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.resolve.alias.set('@triedeti/threedigitaltwin', '@triedeti/threedigitaltwin-dev');
    }
  },
}