export const APP_ENV = process.env.NEXT_PUBLIC_ENV || 'development'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const IS_TEST_MODE = process.env.NEXT_PUBLIC_IS_TEST_MODE === 'true'
export const BUILD_RUN_ID = process.env.NEXT_PUBLIC_BUILD_RUN_ID

// 静态资源文件
export const STATIC_SOURCE_URL = process.env.NEXT_PUBLIC_STATIC_SOURCE_URL || ''

// 品牌域名
export const BRAND_DOMAIN = process.env.NEXT_PUBLIC_BRAND_DOMAIN || ''
export const IS_DEV_MODE = process.env.NEXT_PUBLIC_IS_DEV_MODE === 'true'

// google授权登录相关
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string
export const GOOGLE_REDIRECT_URI = '/auth/google'
export const GOOGLE_SCOPE = 'profile email'

// datadog
export const DATADOG_CLIENT_TOKEN = 'pubaaa2417eb4a63a341c445e31b9e7aec1'

// 在任何地方都能用
export const IS_SERVER_RUNTIME = typeof window === 'undefined'
export const IS_CLIENT_RUNTIME = typeof window !== 'undefined'
