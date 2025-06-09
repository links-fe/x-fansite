import { XLogger, EnumXLoggerLevel } from '@/npm/x-utils'
import { hbSendLog } from '@/utils/datadog'
import { IS_CLIENT_RUNTIME, IS_TEST_MODE } from '@/constants'
import { Log } from '@hb-common/utils'

export const xLogger = new XLogger()

declare global {
  interface Window {
    xLogger?: XLogger
  }
}

if (IS_CLIENT_RUNTIME && IS_TEST_MODE) {
  window.xLogger = xLogger
}

/**
 * datadog日志类型映射表
 */
const DATADOG_LOG_LEVEL_MAP: {
  [EnumXLoggerLevel.Debug]: 'debug'
  [EnumXLoggerLevel.Info]: 'info'
  [EnumXLoggerLevel.Warn]: 'warn'
  [EnumXLoggerLevel.Error]: 'error'
  [EnumXLoggerLevel.Fatal]: 'error'
} = {
  [EnumXLoggerLevel.Debug]: 'debug',
  [EnumXLoggerLevel.Info]: 'info',
  [EnumXLoggerLevel.Warn]: 'warn',
  [EnumXLoggerLevel.Error]: 'error',
  [EnumXLoggerLevel.Fatal]: 'error',
}

// * 事务异常
xLogger.onExceptionReport((report) => {
  Log.red('[exception-event]', report.exceptionLog.message, report)

  hbSendLog({
    // 如果定义了错误码，优先使用错误码
    message: report.code || `[${report.affairKey}] ${report.exceptionLog.message}`,
    status: DATADOG_LOG_LEVEL_MAP[report.exceptionLog.level],
    data: {
      affairKey: report.affairKey,
      exceptionType: report.exceptionType,
      exceptionLog: report.exceptionLog,
      briefLogs: report.briefLogs,
    },
  })
})

// * 事件异常
xLogger.onthrowError((data) => {
  Log.red('[throw-error]', data.message, data)
  hbSendLog({
    // 如果定义了错误码，优先使用错误码
    message: data.code || data.message,
    status: DATADOG_LOG_LEVEL_MAP[data.level],
    data: {
      level: data.level,
      type: data.type,
      category: data.category,
      message: data.message,
      data: data.data,
      meta: data.meta,
    },
  })
})
