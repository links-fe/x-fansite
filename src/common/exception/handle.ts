import { FeatureErrorCodeEnum } from './featureCodeEnum'
import { featureErrorConfig } from './featureErrorConfig'
import { RequestErrorCodeEnum } from './requestCodeEnum'
import { requestErrorConfig } from './requestErrorConfig'
import { IExceptionConfig, XExceptionCode } from './types'
import { XException } from './xException'
import { renderCopywriting } from '@/utils/copywriting'

/** 配置map */
const exceptionConfig: Record<string, IExceptionConfig> = {}
/** 注册 */
export function registerException(config: Record<string, IExceptionConfig>) {
  Object.assign(exceptionConfig, config)
}

export async function handleXException(e: XException) {
  if (!XException.isXException(e)) return

  const code = e.code
  return handleExceptionByCode(code)
}

export async function handleExceptionByCode(code: string) {
  const config = exceptionConfig[code]
  if (!config) return

  if (config.handleType === 'toast') {
    // TODO 弹toast
  }

  if (config.effect) {
    await config.effect()
  }

  return Promise.reject(new XException(code))
}

export async function HANDLE_X_EXCEPTION(e: XException | string) {
  if (typeof e === 'string') {
    return handleExceptionByCode(e)
  }
  return handleXException(e)
}

/** 处理接口请求异常 */
export async function HANDLE_REQUEST_EXCEPTION(code: RequestErrorCodeEnum) {
  return handleExceptionByCode(code)
}

/** 处理业务异常 */
export async function HANDLE_FEATURE_EXCEPTION(code: FeatureErrorCodeEnum) {
  return handleExceptionByCode(code)
}

/** 渲染错误码文案 */
export function RENDER_EXCEPTION_CW(code: XExceptionCode) {
  const config = exceptionConfig[code]
  if (!config) return ''
  const { copywriting } = config
  if (!copywriting) return ''

  return renderCopywriting(copywriting)
}

setTimeout(() => {
  registerException(requestErrorConfig)
  registerException(featureErrorConfig)
}, 0)
