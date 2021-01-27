/* eslint-env es6 */
/* eslint-disable */
const { GenerateSW } = require('workbox-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const urlAPIToCache =
  '(https://shop-api-coop.marketplace-qua.invivodigitalfactory.com|https://shop-api.marketplace-qua.invivodigitalfactory.com|https://api.aladin.farm)'
module.exports = {
  chainWebpack: config => {
    config
      .plugin('add-config')
      .use(HtmlWebpackIncludeAssetsPlugin, [{ assets: ['js/config.js'], append: false, hash: true }])
    config.plugin('config').use(CopyWebpackPlugin, [[{ from: './src/config.js', to: 'js/config.js' }]])
    config.plugin('service-worker').use(GenerateSW, [
      {
        globDirectory: './dist/',
        globPatterns: ['*.{html,js,css,svg}'],
        swDest: 'service-worker.js',
        clientsClaim: true,
        skipWaiting: true,
        importWorkboxFrom: 'local',
        runtimeCaching: [
          {
            // To match cross-origin requests, use a RegExp that matches
            // the start of the origin:assetsPublicPath
            urlPattern: new RegExp(`^${urlAPIToCache}`),
            handler: 'networkFirst',
            options: {
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    ])
    config.module.rule('images').uses.clear()
    config.module
      .rule('images')
      .use('file-loader')
      .loader('file-loader')
      .tap(() => ({
        name: 'img/[name].[hash:8].[ext]'
      }))
    config.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        return Object.assign({ appendTsSuffixTo: [/\.vue$/] }, options)
      })
    return config
  },
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: /node_modules/
      }
    }
  }
}
