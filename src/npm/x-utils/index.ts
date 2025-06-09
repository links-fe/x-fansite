/** 判断是否为移动端 */
export function isMobile() {
  // 添加环境判断，确保只在浏览器环境执行
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export * from './xLogger'
