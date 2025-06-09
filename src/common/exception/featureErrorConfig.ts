import { FeatureErrorCodeEnum } from './featureCodeEnum'
import { IExceptionConfig } from './types'

export const featureErrorConfig: Record<string, IExceptionConfig> = {
  /** unknown error */
  [FeatureErrorCodeEnum['X-F-001']]: {
    handleType: 'toast',
    copywriting: {
      content: 'Unknown Error',
    },
  },
  /** copywriting error */
  [FeatureErrorCodeEnum['CWC-001']]: {
    handleType: 'toast',
    copywriting: {
      content: 'Copywriting Error',
    },
  },
}
