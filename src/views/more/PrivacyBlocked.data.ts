import { getApiRelationQueryBlockUserList } from '@/services/relation'
import { useEffect, useMemo, useState } from 'react'

export interface BlockedUser {
  userId?: number
  userName?: string
  nickName?: string
  headImgUrl?: string
  gmtCreate?: number
}

export function useBlockedValue() {
  const [loading, setLoading] = useState(false)
  const [blockState, setBlockState] = useState({
    items: [] as BlockedUser[],
    cursor: '',
    hasNext: true,
    total: 0,
  })
  const blockTotal = useMemo(() => blockState.total, [blockState.total])

  async function fetchBlocked(size = 10, page = 1) {
    try {
      setLoading(true)

      const res = await getApiRelationQueryBlockUserList({ size, page })
      setBlockState({
        ...blockState,
        total: res?.total || 0,
        items: res?.items || [], // items: Array.from(Array(20).keys()).map((i) => ({ userId: String(i) })),
        cursor: res?.cursor || '',
        hasNext: res?.hasNext || false,
      })
      return res
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchNextBlocked(next = 1) {
    if (!blockState.hasNext || loading) return
    const res = await fetchBlocked(15, next)
    if (res?.items?.length) {
      const items = [...blockState.items, ...res?.items]
      setBlockState({
        ...blockState,
        items,
        total: res?.total || 0,
        cursor: res?.cursor || '',
        hasNext: res?.hasNext || false,
      })
    }
  }

  return {
    loading,
    setLoading,
    blockState,
    setBlockState,
    blockTotal,
    fetchBlocked,
    fetchNextBlocked,
  }
}
