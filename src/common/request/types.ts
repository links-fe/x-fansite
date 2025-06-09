import { IBearRequestConfig } from '@hb-common/bear-request'
import type { AxiosResponse } from 'axios'
import { XException } from '../exception'

export interface IRequestConfig extends IBearRequestConfig {
  /** 自定义异常捕获 */
  customErrorCapture?: (response: AxiosResponse<any, any>, exception?: XException) => XException | any

  /** 禁用错误处理 */
  disbaleErrorHandle?: boolean

  /** 自定义错误处理 */
  customErrorHandler?: (exception: XException) => void
}
