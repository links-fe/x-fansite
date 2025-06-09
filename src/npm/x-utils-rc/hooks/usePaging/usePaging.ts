import { useEffect, useRef } from 'react'
import { Paging } from './paging'
import { IUsePaging, IUsePagingProps } from './types'
import { useUpdate } from '../useUpdate'

export function usePaging<T, P extends object>(props: IUsePagingProps<T, P>): IUsePaging<T, P> {
  const paging = useRef<Paging<T, P>>(new Paging(props))

  const state = paging.current.getState()

  const update = useUpdate()

  useEffect(() => {
    paging.current.onStateChange('usePaging', () => {
      update()
    })
    return () => {
      paging.current.offStateChange('usePaging')
    }
  }, [])

  return {
    hasMore: state.hasMore,
    data: state.data,
    loading: state.loading,
    reloading: state.reloading,
    isError: state.isError,
    isEmpty: state.isEmpty,
    isConfinedLoadMore: state.isConfinedLoadMore,
    isLoadMoreError: state.isLoadMoreError,

    loadMore: () => {
      return paging.current.loadMore()
    },
    clear: () => {
      return paging.current.clear()
    },
    reload: (params: P) => {
      return paging.current.reload(params)
    },

    getQueryParams: () => state.queryParams,
  }
}
