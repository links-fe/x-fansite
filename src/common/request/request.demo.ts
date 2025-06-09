import { RequestErrorCodeEnum } from '../exception/requestCodeEnum'
import { request } from './request'
import { HANDLE_X_EXCEPTION, XException } from '../exception'
import { FeatureErrorCodeEnum } from '../exception/featureCodeEnum'

// * 1. 默认catch
await request.get('/api')

// * 2. 自定义异常捕获

export async function demo1() {
  await request.get('/api', {
    customErrorCapture: (response, exception) => {
      // 如果不是ENT-http, 则沿用默认处理 (如: 请求超时)
      if (exception?.code !== RequestErrorCodeEnum['NET-http']) {
        return exception
      }

      const responseCode = response.data.code

      if (responseCode === 1234) {
        return new XException('X-S-9990')
      }

      if (responseCode === 5678) {
        return response.data
      }

      // 前置捕获到了公共异常
      if (XException.isXException(exception)) {
        return exception
      } else {
        // 前置未捕获到异常
        return response.data
      }
    },
  })
}

// * 3. 自定义异常处理
export async function demo2() {
  await request.get('/api', {
    customErrorCapture: (response, exception) => {
      // 如果不是ENT-http, 则沿用默认处理 (如: 请求超时)
      if (exception?.code !== RequestErrorCodeEnum['NET-http']) {
        return exception
      }

      const responseCode = response.data.code

      if (responseCode === 1234) {
        return new XException('X-S-9990')
      }

      if (responseCode === 5678) {
        return response.data
      }

      // 前置捕获到了公共异常
      if (XException.isXException(exception)) {
        return exception
      } else {
        // 前置未捕获到异常
        return response.data
      }
    },
    disbaleErrorHandle: true,
    customErrorHandler: (exception) => {
      if (!XException.isXException(exception)) {
        return
      }
      if (exception.code === RequestErrorCodeEnum['NET-401']) {
        return HANDLE_X_EXCEPTION(FeatureErrorCodeEnum['X-F-001'])
      }
      return HANDLE_X_EXCEPTION(exception)
    },
  })
}
