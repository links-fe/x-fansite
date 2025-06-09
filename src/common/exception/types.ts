import { ICopywritingConfig } from '@/utils/copywriting'
import { FeatureErrorCodeEnum } from './featureCodeEnum'
import { RequestErrorCodeEnum } from './requestCodeEnum'

export interface IExceptionConfig {
  // httpCode?: number
  // responseCode?: number

  handleType?: 'mode' | 'toast' | 'drawer' | 'modal' | 'silent' | 'custom'
  /** 当handleType为mode时，指定mode 例: login retry */
  handleMode?: 'login' | 'modal:retry'

  copywriting?: ICopywritingConfig

  /** 自定义附加影响 */
  effect?: () => Promise<void> | void
}

export type XExceptionCode = FeatureErrorCodeEnum | RequestErrorCodeEnum
