/**
 * 前端日志 - 更规范的日志记录和更有效的收集日志
 * 为前端聚合日志打基础
 */

import { Event } from '@hb-common/utils'
import { nanoid } from 'nanoid'

export enum EnumXLoggerLevel {
  /** 调试 */
  Debug = 1,
  /** 信息 */
  Info = 2,
  /** 警告 */
  Warn = 3,
  /** 错误 */
  Error = 4,
  /** 致命错误 */
  Fatal = 5,
}

export enum EnumXLoggerType {
  /** 事务 */
  Affair = 'affair',
  /** 状态 */
  Status = 'status',
  /** 普通 */
  Normal = 'normal',
}

export enum EnumXLoggerCategory {
  // 业务日志
  Business = 'business',
  // 系统日志
  System = 'system',
  /** 异常 */
  Exception = 'exception',
  /** 接口请求 */
  Request = 'request',
  /** 用户行为 */
  Behavior = 'behavior',
  /* 性能日志 */
  // Performance = 'performance',
}

export enum EnumExceptionType {
  /** 出错 */
  Error = 'error',
  /** 呆滞 */
  Stuck = 'stuck',
  /** 损坏 */
  Broken = 'broken',
  /** 假死 */
  Dead = 'dead',
  /** 崩溃 */
  Crash = 'crash',
}

interface XLoggerLogItem {
  id: string
  code?: string
  level: EnumXLoggerLevel
  type: EnumXLoggerType
  category: EnumXLoggerCategory
  time: number
  message: string
  data: any

  meta: {
    /** 事务key */
    affairKey?: string
    /** 异常类型 */
    exceptionType?: EnumExceptionType
  }
}

interface XLoggerExceptionReport {
  /** 代码 */
  code?: string
  /** 事务key */
  affairKey: string
  /** 异常类型 */
  exceptionType: EnumExceptionType
  /** 异常日志 */
  exceptionLog: XLoggerLogItem
  /** 简要日志 */
  briefLogs: XLoggerLogItem[]
}

export class XLogger {
  public config = {
    /** 最多存储数 */
    limitCacheLogsLength: 1000,
    /** 异常事件报告事务最大限制 */
    limitExceptionAffairLogsLength: 20,
    /** 基于异常事件往前时间 */
    limitExceptionAffairLogsTime: 1000 * 60 * 2,
  }
  private _logs: XLoggerLogItem[] = []
  private _loggerId = nanoid(16)
  private _logIndex = 0

  public isDebug = false

  public event = new Event<'exception-report' | 'throw-error'>()

  public record(item: Partial<XLoggerLogItem>) {
    const row = {
      id: `${this._loggerId}-${this._logIndex++}`,
      time: Date.now(),
      level: EnumXLoggerLevel.Info,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message: '',
      data: {},
      meta: {},
      ...item,
    }
    row.message = row.message.slice(0, 1000)

    this._logs.push(row)
    if (this._logs.length > this.config.limitCacheLogsLength) {
      // 保留最新的
      this._logs = this._logs.slice(-this.config.limitCacheLogsLength)
    }

    if (row.level >= EnumXLoggerLevel.Error) {
      this.event.emit('throw-error', row)
    } else {
      // this.isDebug && console.log(row.message, row.data)
      if (this.isDebug) {
        console.log(row.message, row.data)
      }
    }

    return row
  }

  /** 抛出异常 */
  public throwException(exceptionType: EnumExceptionType, message: string, data: any) {
    const row = this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Exception,
      message,
      data,
      meta: { exceptionType },
    })
    const report = this._generateExceptionReport(row.id)
    if (report) {
      this.event.emit('exception-report', report)
    }
    return row
  }

  /** 抛出错误码 */
  public throwCode(code: string, message: string, data: any) {
    const row = this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Exception,
      message,
      data,
      code,
    })
    const report = this._generateExceptionReport(row.id)
    if (report) {
      this.event.emit('exception-report', report)
    }
    return row
  }

  /** 抛出事务异常 */
  public throwAffairException(exceptionType: EnumExceptionType, affairKey: string, message: string, data: any) {
    const row = this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Affair,
      category: EnumXLoggerCategory.Exception,
      message,
      data,
      meta: {
        affairKey,
        exceptionType,
      },
    })
    const report = this._generateExceptionReport(row.id)
    if (report) {
      this.event.emit('exception-report', report)
    }
  }
  public error(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public warn(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Warn,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public info(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Info,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public debug(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Debug,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public fatal(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Fatal,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }

  public affiarError(affairKey: string, message: string, data: unknown) {
    return this.error(message, data, { affairKey })
  }
  public affiarWarn(affairKey: string, message: string, data: unknown) {
    return this.warn(message, data, { affairKey })
  }
  public affiarInfo(affairKey: string, message: string, data: unknown) {
    return this.info(message, data, { affairKey })
  }
  public affiarDebug(affairKey: string, message: string, data: unknown) {
    return this.debug(message, data, { affairKey })
  }
  public affiarFatal(affairKey: string, message: string, data: unknown) {
    return this.fatal(message, data, { affairKey })
  }

  // 生成异常
  private _generateExceptionReport(id: string): XLoggerExceptionReport | undefined {
    // 1. 收集相同事务
    // 2. 收集 level >= error 的日志

    const state = {
      hadFindExceptionLog: false,
      briefLogs: [] as XLoggerLogItem[],
      isAffairException: false,
      exceptionLog: undefined as XLoggerLogItem | undefined,
    }
    for (let i = this._logs.length - 1; i >= 0; i--) {
      const log = this._logs[i]

      if (state.hadFindExceptionLog) {
        // 如果是事务异常, 非此事务只收集等级大于等于error的日志
        if (state.isAffairException) {
          if (log.meta?.affairKey === state.exceptionLog?.meta?.affairKey || log.level >= EnumXLoggerLevel.Error) {
            state.briefLogs.push(log)
          }
        } else {
          state.briefLogs.push(log)
        }

        // 如果达到限制，结束
        if (
          state.briefLogs.length >= this.config.limitExceptionAffairLogsLength ||
          (state.exceptionLog?.time &&
            log.time &&
            log.time - state.exceptionLog.time > this.config.limitExceptionAffairLogsTime)
        ) {
          break
        }

        continue
      }

      if (log.id === id) {
        // 如果不是异常日志，直接退出
        if (log.category !== EnumXLoggerCategory.Exception) return
        state.hadFindExceptionLog = true
        state.briefLogs.push(log)
        state.exceptionLog = log
        state.isAffairException = log.type === EnumXLoggerType.Affair
        continue
      }
    }

    return {
      affairKey: state.exceptionLog?.meta?.affairKey || '',
      exceptionType: state.exceptionLog?.meta?.exceptionType || EnumExceptionType.Error,
      exceptionLog: state.exceptionLog as XLoggerLogItem,
      briefLogs: state.briefLogs.map((v) => {
        return {
          ...v,
          data: null,
          dataLength: JSON.stringify(v.data)?.length,
        }
      }),
    }
  }

  public onExceptionReport(fn: (report: XLoggerExceptionReport) => void) {
    this.event.off('main', 'exception-report')
    this.event.on('main', 'exception-report', fn)
  }

  public onthrowError(fn: (data: XLoggerLogItem) => void) {
    this.event.off('main', 'throw-error')
    this.event.on('main', 'throw-error', fn)
  }

  public createAffairLogger(affairKey: string) {
    return new HbAffiarLogger(this, affairKey)
  }
}

// 事务日志快捷方式 - 少一个入参更友好
class HbAffiarLogger {
  private _logger: XLogger
  private _affairKey: string

  constructor(logger: XLogger, affairKey: string) {
    this._logger = logger
    this._affairKey = affairKey
  }

  public error(message: string, data?: unknown) {
    return this._logger.affiarError(this._affairKey, `[${this._affairKey}] ${message}`, data)
  }
  public warn(message: string, data?: unknown) {
    return this._logger.affiarWarn(this._affairKey, `[${this._affairKey}] ${message}`, data)
  }
  public info(message: string, data?: unknown) {
    return this._logger.affiarInfo(this._affairKey, `[${this._affairKey}] ${message}`, data)
  }
  public debug(message: string, data?: unknown) {
    return this._logger.affiarDebug(this._affairKey, `[${this._affairKey}] ${message}`, data)
  }
  public fatal(message: string, data?: unknown) {
    return this._logger.affiarFatal(this._affairKey, `[${this._affairKey}] ${message}`, data)
  }

  public throwException(exceptionType: EnumExceptionType, message: string, data?: unknown) {
    return this._logger.throwAffairException(exceptionType, this._affairKey, `[${this._affairKey}] ${message}`, data)
  }
}
