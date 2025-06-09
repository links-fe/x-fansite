declare module '*.scss'
declare module '*.css'
// 环境模块声明
declare module 'global-extension' {
  global {
    interface Window {
      grecaptcha: {
        enterprise: {
          ready: (callback: () => void) => void
          execute: (siteKey: string, options: { action: string }) => Promise<string>
        }
      }
    }
  }
}
