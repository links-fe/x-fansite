import { useSearchParams, useRouter } from 'next/navigation'

const useRemoveQueryParams = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const removeQueryParams = (paramsKey: string[]) => {
    if (!searchParams || !paramsKey?.length) {
      return
    }
    // 复制当前查询参数
    const newSearchParams = new URLSearchParams(searchParams.toString())
    for (const key of paramsKey) {
      // 移除指定的查询参数
      newSearchParams.delete(key)
    }
    // 构建新的路径
    const newPath = `${window.location.pathname}?${newSearchParams.toString()}`
    // 使用 replace 方法更新 URL，不添加历史记录
    router.replace(newPath)
  }
  return {
    removeQueryParams,
  }
}
export default useRemoveQueryParams
