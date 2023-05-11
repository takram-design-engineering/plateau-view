const { composePlugins, withNx } = require('@nx/webpack')
const webpack = require('webpack')

module.exports = composePlugins(withNx(), config => {
  config.plugins.push(new webpack.EnvironmentPlugin(['VECTOR_TILE_CACHE_ROOT']))
  return config
})
