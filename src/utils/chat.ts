import { getActiveAccountId } from '@/models/user'

/**
 * 从对象中选择指定的属性创建一个新对象
 * @param obj 源对象
 * @param keys 要选择的属性数组
 * @returns 包含选定属性的新对象
 *
 * @example
 * const object = { 'a': 1, 'b': '2', 'c': 3 };
 * pick(object, ['a', 'c']); // => { 'a': 1, 'c': 3 }
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }

  return result
}

/**
 * 从对象中选择指定的属性创建一个新对象，支持深层路径
 * @param obj 源对象
 * @param paths 要选择的属性路径数组
 * @returns 包含选定属性的新对象
 *
 * @example
 * const object = { 'a': { 'b': { 'c': 3 } }, 'd': 4 };
 * pickDeep(object, ['a.b.c', 'd']); // => { 'a': { 'b': { 'c': 3 } }, 'd': 4 }
 */
export function pickDeep<T extends object>(obj: T, paths: string[]): Partial<T> {
  const result: any = {}

  for (const path of paths) {
    const keys = path.split('.')
    let current = obj
    let target = result

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if (i === keys.length - 1) {
        if (key in current) {
          target[key] = (current as any)[key]
        }
      } else {
        target[key] = target[key] || {}
        current = (current as any)[key] || {}
        target = target[key]
      }
    }
  }

  return result
}

/**
 * 从对象中选择满足条件的属性创建一个新对象
 * @param obj 源对象
 * @param predicate 判断函数，返回true的属性会被选择
 * @returns 包含选定属性的新对象
 *
 * @example
 * const object = { 'a': 1, 'b': '2', 'c': 3 };
 * pickBy(object, value => typeof value === 'number'); // => { 'a': 1, 'c': 3 }
 */
export function pickBy<T extends object>(obj: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T> {
  const result: Partial<T> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(obj[key], key)) {
      result[key] = obj[key]
    }
  }

  return result
}

/**
 * 格式化时间
 * @param seconds 秒
 * @returns 格式化后的时间字符串，格式为 `HH:MM:SS`. 如果小时数为 0，则不显示小时部分。
 */
export function formatTime(seconds: number) {
  if (!seconds) return ''

  const totalSeconds = Math.floor(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const formattedHours = hours > 0 ? `${hours}:` : ''
  const formattedMinutes = `${minutes.toString().padStart(2, '0')}:`
  const formattedSeconds = secs.toString().padStart(2, '0')

  return `${formattedHours}${formattedMinutes}${formattedSeconds}`
}

/**
 * 判断是否自己发送的消息
 */
export const isSelfSendMessage = (id?: string) => {
  if (!id) return false
  return id === getActiveAccountId()
}
