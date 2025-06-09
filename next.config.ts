import withBundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'
import { webpack as AutoIconify } from '@x-vision/icons/unplugin'

const isAnalyze = process.env.ANALYZE === 'true'
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(AutoIconify({ collections: ['@x-vision/icons'] }))
    return config
  },

  // 把 @hb-common/utils 拉进编译流程
  transpilePackages: ['@hb-common/utils'],
}

if (process.env.NODE_ENV !== 'development') {
  nextConfig.output = 'export'
  nextConfig.distDir = 'dist'
  // 静态导出以下扩展名的文件 https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions
  nextConfig.pageExtensions = ['tsx', 'jsx']
  nextConfig.images = {
    unoptimized: true, // 禁用优化 (解决 静态导出后 图片路径会有问题)
  }
} else {
  nextConfig.redirects = async () => {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/--demo',
        destination: '/--demo/demo1',
        permanent: true,
      },
    ]
  }
  Object.assign(nextConfig, {
    reactStrictMode: false,
    experimental: {
      turbo: {
        resolveAlias: {
          '@x-vision/icons': './scripts/icons.mjs',
        },
      },
    },
  })
}

export default withBundleAnalyzer({
  enabled: isAnalyze,
})(nextConfig)
