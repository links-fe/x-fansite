import { useState } from 'react'
import { useUpdate } from './useUpdate'

export function useRequest<R, P = undefined>(request: (params: P) => Promise<R>) {
  const [state] = useState<{
    data: R | null
    error: Error | null
    loading: boolean
    hadRun: boolean
  }>({
    data: null,
    error: null,
    loading: false,
    hadRun: false,
  })
  const update = useUpdate()

  async function run(params: P) {
    state.loading = true
    update()

    try {
      const data = await request(params)
      state.data = data
      state.error = null
      state.hadRun = true
    } catch (e: any) {
      state.error = e
    } finally {
      state.loading = false
      update()
    }
  }

  return {
    run,
    data: state.data,
    error: state.error,
    loading: state.loading,
    hadRun: state.hadRun,
  }
}
