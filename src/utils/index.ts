import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

/**
 * 合并多个类名，支持条件性添加类名并处理 Tailwind CSS 类名冲突
 *
 * @param {...any} args - 任意数量的参数，这些参数可以是字符串、对象或数组，用于动态生成类名
 * @returns {string} - 合并后的类名，去除了冲突的类名
 *
 * @example
 * // 条件性添加类名
 * const classes = classMerge('text-red-500', { 'bg-blue-500': isActive });
 *
 * @example
 * // 合并多个类名
 * const combinedClasses = classMerge('px-4', 'py-2', 'rounded');
 */
export function classMerge(...args: any) {
  return twMerge(classNames(...args))
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createRandomId() {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).slice(2, 10)
  return idStr
}

/** 动态引入脚本 */
export function importScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ele = document.createElement('script')
    ele.src = src
    ele.async = true
    // ele.crossOrigin = 'anonymous';
    ele.onload = function () {
      resolve()
    }
    ele.onerror = function () {
      reject()
    }
    document.body.appendChild(ele)
  })
}

// 验证电子邮件格式
export const runValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email?.trim?.())
}

/**
 * 深度合并对象，只更新源对象中的属性
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的新对象
 */
export function mergeExistingProperties<T extends object>(target: T, source: Partial<T>): T {
  // 如果不是对象或为null，直接返回目标值
  if (!isObject(target) || !isObject(source)) {
    return target
  }

  // 创建目标对象的浅拷贝
  const result = { ...target } as T

  // 遍历源对象的所有属性
  Object.keys(source).forEach((key) => {
    const targetValue = target[key as keyof T]
    const sourceValue = source[key as keyof T]

    // 如果两边都是对象，递归合并
    if (isObject(targetValue) && isObject(sourceValue)) {
      result[key as keyof T] = mergeExistingProperties(targetValue, sourceValue as any) as any
    }
    // 如果两边都是数组，创建新数组
    else if (Array.isArray(sourceValue)) {
      result[key as keyof T] = [...sourceValue] as any
    }
    // 其他情况，如果源值不是undefined则更新
    else if (sourceValue !== undefined) {
      result[key as keyof T] = sourceValue as any
    }
  })

  return result
}

/**
 * 判断是否为普通对象
 */
function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 对象数组按指定字段从大到小排序
 * @param array 要排序的对象数组
 * @param key 排序的字段名
 * @param nullsLast 是否将空值排在最后，默认为 true
 * @returns 排序后的新数组
 */
export function sortArrayByKey<T extends object>(array: T[], key: keyof T, nullsLast: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key]
    const valueB = b[key]

    // 处理空值情况
    if (valueA == null && valueB == null) return 0
    if (valueA == null) return nullsLast ? 1 : -1
    if (valueB == null) return nullsLast ? -1 : 1

    // 数字比较
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueB - valueA
    }

    // 字符串比较
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueB.localeCompare(valueA)
    }

    // 日期比较
    if (valueA instanceof Date && valueB instanceof Date) {
      return valueB.getTime() - valueA.getTime()
    }

    return 0
  })
}

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本
 * @returns 复制操作是否成功
 * @example
 * onCopyText("Hello, World!")
 */
export async function onCopyText(text: string): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed' // 避免滚动到元素位置
    document.body.appendChild(textarea)
    textarea.select()

    const result = document.execCommand('copy')
    document.body.removeChild(textarea)
    return result
  } catch (error) {
    console.error('Copy failed:', error)
    return false
  }
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 防抖时间，默认0ms
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 0,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 生成唯一随机 ID
 * @returns 唯一随机字符串
 */
export function generateUniqueId() {
  // 获取当前时间戳并转换为 36 进制字符串
  let idStr = Date.now().toString(36)
  // 生成随机数并转换为 36 进制字符串，截取部分添加到时间戳后面
  idStr += Math.random().toString(36).slice(2, 10)
  return idStr
}

// 工具函数：将秒数转换为 分:秒 格式
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  // 确保秒数为两位数
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 邮箱加密函数
 * 将邮箱部分字符替换为掩码，同时保留原始邮箱的后缀
 * @example
 * encryptEmail("liu@gmail.com")    // "l***u@g*****.com"
 * encryptEmail("admin@example.org") // "a****n@e******.org"
 * encryptEmail("a@b.co.uk")       // "a@b******.co.uk"
 */
export function encryptEmail(email: string, maskChar: string = '*'): string {
  // 检查邮箱格式是否合法
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return email // 如果不是合法邮箱，直接返回原字符串
  }

  // 分割用户名和域名部分
  const [username, domainWithExt] = email.split('@')

  // 分离域名和后缀
  const lastDotIndex = domainWithExt.lastIndexOf('.')
  const domain = domainWithExt.substring(0, lastDotIndex)
  const extension = domainWithExt.substring(lastDotIndex)

  // 加密用户名部分（保留首尾字符，中间用掩码替换）
  const encryptedUsername =
    username.length > 1
      ? username[0] + maskChar.repeat(Math.max(0, username.length - 2)) + username.slice(-1)
      : username // 如果用户名长度 <=1，不加密

  // 加密域名部分（保留第一个字符，其余用掩码替换）
  const encryptedDomain = domain.length > 1 ? domain[0] + maskChar.repeat(Math.max(0, domain.length - 1)) : domain // 如果域名长度 <=1，不加密

  // 组合加密后的邮箱，保留原始后缀
  return `${encryptedUsername}@${encryptedDomain}${extension}`
}

/**
 * 获取浏览器默认语言环境
 * @returns 浏览器语言环境字符串（如 'en-US'）
 */
function getBrowserLocale(): string {
  // 优先使用 navigator.languages（多语言偏好列表）
  if (typeof navigator !== 'undefined' && navigator.languages?.length) {
    return navigator.languages[0]
  }

  // 回退到 navigator.language 或默认值
  return (typeof navigator !== 'undefined' && navigator.language) || 'en-US'
}

/**
 * 根据 locale 格式化日期
 * @param date - 需要格式化的日期对象或时间戳
 * @param options - 格式化选项
 * @param options.locale - 指定语言环境（默认使用浏览器语言）
 * @param options.formatStyle - 日期格式样式（默认 'short'）
 * @param options.customOptions - 自定义 Intl.DateTimeFormat 选项
 * @returns 格式化后的日期字符串
 */
export function formatLocalizedDate(
  date: Date | number,
  options: {
    locale?: string
    formatStyle?: 'full' | 'long' | 'medium' | 'short'
    customOptions?: Intl.DateTimeFormatOptions
  } = {},
): string {
  // 获取默认参数
  const { locale = getBrowserLocale(), formatStyle = 'short', customOptions = {} } = options

  // 合并默认格式选项和自定义选项
  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: formatStyle,
    ...customOptions,
  }

  // 创建格式化器并格式化日期
  const formatter = new Intl.DateTimeFormat(locale, formatOptions)
  return formatter.format(date)
}
