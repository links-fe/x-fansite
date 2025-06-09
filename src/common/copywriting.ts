import { X_CW_CONFIG } from '@/copywriting'
import { renderCopywriting } from '@/utils/copywriting'
import { xLogger } from './logger'

function _renderCW(key: keyof typeof X_CW_CONFIG, params?: Record<string, unknown>, isRetry = false): string {
  try {
    return renderCopywriting(X_CW_CONFIG[key], params)
  } catch (error) {
    // 如果是重试，直接返回错误, 防止死循环
    if (isRetry) {
      return 'error'
    }
    xLogger.error('render copywriting failed', { key, params, error })
    return _renderCW('CWC-001', params, true)
  }
}

export function RENDER_CW(key: XCwKeyType, params?: Record<string, unknown>) {
  return _renderCW(key, params)
}

export function getCwConfig(key: XCwKeyType) {
  return X_CW_CONFIG[key]
}

export type XCwKeyType = keyof typeof X_CW_CONFIG
