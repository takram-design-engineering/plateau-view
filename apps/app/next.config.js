// @ts-check

const path = require('path')
const { withNx } = require('@nx/next/plugins/with-nx')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false
  },

  reactStrictMode: true,

  // To run server on Docker.
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../')
  },

  // To import GLSL as text.
  webpack: config => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: 'raw-loader'
    })
    return config
  }
}

module.exports = withNx(withBundleAnalyzer(nextConfig))
