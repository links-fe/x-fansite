interface RouterConfigInfo {
  // 添加路径匹配模式, 用于动态路由
  pattern?: RegExp
  // pc page布局
  pcPageLayout?: string
  // mobile page布局
  mobilePageLayout?: string
  // content layout 预留的拓展
  pcContentLayout?: string
  mobileContentLayout?: string
  // 子路由
  children?: Record<string, RouterConfigInfo>
  isAuth?: boolean
}

const MobileNoTabbarLayout = 'MobileNoTabbarLayout'
const MobileTabbarLayout = 'MobileTabbarLayout'
const PcMenuLayout = 'PcMenuLayout'
const PcEmptyLayout = 'PcEmptyLayout'
const MobileNoTabbarLayout = 'MobileNoTabbarLayout'
const PcHooksLayout = 'PcHooksLayout'
const PcChatLayout = 'PcChatLayout'
const PcSettingLayout = 'PcSettingLayout'
const PcLoginLayout = 'PcLoginLayout'
const DemoLayout = 'DemoLayout'

// menu layout 配置
const routerLayoutConfigInfo: Record<string, RouterConfigInfo> = {
  '/': {
    pcPageLayout: PcEmptyLayout,
    mobilePageLayout: MobileNoTabbarLayout,
    children: {
      '/home': {
        isAuth: true,
        pcPageLayout: PcMenuLayout,
        mobilePageLayout: MobileTabbarLayout,
      },
      '/hooks': {
        isAuth: true,
        pcPageLayout: PcHooksLayout,
        mobilePageLayout: MobileTabbarLayout,
      },
      'share-link': {},
      /**----------------------------------- message 页面 -----------------------------------*/
      '/message': {
        isAuth: true,
        pcPageLayout: PcChatLayout,
        mobilePageLayout: MobileTabbarLayout,
        children: {
          // 动态路由示例：匹配 /message/123 这样的路径
          '/message/:id': {
            mobilePageLayout: MobileNoTabbarLayout,
            pattern: /^\/message\/\w+$/,
            isAuth: true,
          },
        },
      },
      /**----------------------------------- more 页面 -----------------------------------*/
      '/more': {
        isAuth: true,
        pcPageLayout: PcSettingLayout,
        mobilePageLayout: MobileTabbarLayout,
        children: {
          '/more/profile': {
            mobilePageLayout: MobileNoTabbarLayout,
            children: {
              '/more/profile/bio': {},
              '/more/profile/location': {},
              '/more/profile/name': {},
              '/more/profile/username': {},
            },
          },
          '/more/setting': {
            mobilePageLayout: MobileNoTabbarLayout,
            children: {
              '/more/setting/about': {
                children: {
                  '/more/setting/about/detail': {},
                },
              },
              '/more/setting/account': {
                children: {
                  '/more/setting/account/change-email': {},
                  '/more/setting/account/change-password': {},
                  '/more/setting/account/third-party-accounts': {},
                },
              },
              '/more/setting/delete-account': {},
              '/more/setting/help-center': {
                children: {
                  '/more/setting/help-center/faq-details': {},
                  '/more/setting/help-center/faq': {},
                  '/more/setting/help-center/feedback': {},
                },
              },
              '/more/setting/notifications': {
                children: {
                  '/more/setting/notifications/email': {},
                  '/more/setting/notifications/push': {},
                },
              },
              '/more/setting/privacy': {
                children: {
                  '/more/setting/privacy/blocked': {},
                  '/more/setting/privacy/visibility': {},
                },
              },
            },
          },
        },
      },
      '/--demo': {
        pcPageLayout: PcMenuLayout,
        mobilePageLayout: MobileNoTabbarLayout,
        children: {
          '/--demo/chat': {
            pcPageLayout: PcEmptyLayout,
            mobilePageLayout: MobileNoTabbarLayout,
          },
          '/--demo/login': {
            pcPageLayout: PcLoginLayout,
            children: {
              '/--demo/login/creator-share': {},
            },
          },
          '/--demo/game': {
            children: {
              '/--demo/game/clean-stickers': {
                pcPageLayout: DemoLayout,
              },
            },
          },
          '/--demo/google': {
            pcPageLayout: DemoLayout,
          },
          '/--demo/google-recaptcha': {
            pcPageLayout: DemoLayout,
          },
        },
      },
    },
  },
}

// 添加一个辅助函数来获取路由配置
const getRouterInfo = (path?: string): Pick<RouterConfigInfo, 'isAuth' | 'pcPageLayout' | 'mobilePageLayout'> => {
  // 处理空路径或undefined的情况，返回根路径的配置
  if (!path) {
    return {
      pcPageLayout: PcEmptyLayout,
      mobilePageLayout: MobileNoTabbarLayout,
    }
  }

  // 获取根路径配置
  const rootConfig = routerLayoutConfigInfo['/']
  if (!rootConfig || !rootConfig.children) {
    return {
      pcPageLayout: PcEmptyLayout,
      mobilePageLayout: MobileNoTabbarLayout,
    }
  }

  // 移除开头的'/'并分割路径
  const pathSegments = path.split('/').filter(Boolean)

  // 如果是根路径'/'
  if (pathSegments.length === 0) {
    return {
      pcPageLayout: rootConfig.pcPageLayout,
      mobilePageLayout: rootConfig.mobilePageLayout,
    }
  }

  // 构建路径并逐级查找配置
  let currentPath = ''
  let result: Pick<RouterConfigInfo, 'isAuth' | 'pcPageLayout' | 'mobilePageLayout'> = {
    pcPageLayout: rootConfig.pcPageLayout,
    mobilePageLayout: rootConfig.mobilePageLayout,
    isAuth: rootConfig.isAuth,
  }

  let currentConfig = rootConfig

  // 逐级遍历路径
  for (const segment of pathSegments) {
    currentPath = currentPath ? `${currentPath}/${segment}` : `/${segment}`

    if (!currentConfig.children) {
      break
    }

    // 检查精确匹配
    let nextConfig = currentConfig.children[currentPath]

    // 如果没有精确匹配，检查动态路由
    if (!nextConfig) {
      for (const [_, config] of Object.entries(currentConfig.children)) {
        if (config.pattern && config.pattern.test(currentPath)) {
          nextConfig = config
          break
        }
      }
    }

    if (nextConfig) {
      // 继承配置，只继承存在的属性
      result = {
        pcPageLayout: nextConfig.pcPageLayout ?? result.pcPageLayout,
        mobilePageLayout: nextConfig.mobilePageLayout ?? result.mobilePageLayout,
        isAuth: nextConfig.isAuth ?? result.isAuth,
      }
      currentConfig = nextConfig
    }
  }

  return result
}

describe('getRouterInfo', () => {
  // 测试空路径和根路径
  describe('root path cases', () => {
    it('should return default layout for undefined path', () => {
      expect(getRouterInfo()).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should return default layout for empty path', () => {
      expect(getRouterInfo('')).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should return root config for "/" path', () => {
      expect(getRouterInfo('/')).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })
    it('should return root config for "/share-link" path', () => {
      expect(getRouterInfo('/share-link')).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })
  })

  // 测试一级路径
  describe('first level path cases', () => {
    it('should return correct config for /home', () => {
      expect(getRouterInfo('/home')).toEqual({
        isAuth: true,
        pcPageLayout: PcMenuLayout,
        mobilePageLayout: MobileTabbarLayout,
      })
    })

    it('should return correct config for /hooks', () => {
      expect(getRouterInfo('/hooks')).toEqual({
        isAuth: true,
        pcPageLayout: PcHooksLayout,
        mobilePageLayout: MobileTabbarLayout,
      })
    })

    it('should return correct config for /message', () => {
      expect(getRouterInfo('/message')).toEqual({
        isAuth: true,
        pcPageLayout: PcChatLayout,
        mobilePageLayout: MobileTabbarLayout,
      })
    })
  })

  // 测试二级及多级路径
  describe('nested path cases', () => {
    it('should return correct config for /more/profile', () => {
      expect(getRouterInfo('/more/profile')).toEqual({
        isAuth: true,
        pcPageLayout: PcSettingLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should return correct config for /more/setting', () => {
      expect(getRouterInfo('/more/setting')).toEqual({
        isAuth: true,
        pcPageLayout: PcSettingLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should return correct config for deeply nested path /more/setting/privacy', () => {
      expect(getRouterInfo('/more/setting/privacy')).toEqual({
        isAuth: true,
        pcPageLayout: PcSettingLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })
  })

  // 测试 Demo 路径
  describe('demo path cases', () => {
    it('should return correct config for /--demo/chat', () => {
      expect(getRouterInfo('/--demo/chat')).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should return correct config for /--demo/login', () => {
      expect(getRouterInfo('/--demo/login')).toEqual({
        pcPageLayout: PcLoginLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should return correct config for /--demo/game/clean-stickers', () => {
      expect(getRouterInfo('/--demo/game/clean-stickers')).toEqual({
        pcPageLayout: DemoLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })
  })

  // 测试动态路由
  describe('dynamic route cases', () => {
    it('should return correct config for dynamic route /message/123', () => {
      expect(getRouterInfo('/message/123')).toEqual({
        isAuth: true,
        pcPageLayout: PcChatLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })
  })

  // 测试无效路径
  describe('invalid path cases', () => {
    it('should return default layout for non-existent path', () => {
      expect(getRouterInfo('/non/existent/path')).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should return default layout for invalid first level path', () => {
      expect(getRouterInfo('/invalid')).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })
  })

  // 测试布局继承
  describe('layout inheritance cases', () => {
    it('should inherit layouts from parent route when not specified', () => {
      expect(getRouterInfo('/more/profile/bio')).toEqual({
        isAuth: true,
        pcPageLayout: PcSettingLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })

    it('should override parent layouts when specified', () => {
      expect(getRouterInfo('/--demo/chat')).toEqual({
        pcPageLayout: PcEmptyLayout,
        mobilePageLayout: MobileNoTabbarLayout,
      })
    })
  })
})
