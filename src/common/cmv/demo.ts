import { generateAccountCacheStoreFn, generateContactCacheStoreFn } from '@/common/cmv'
import { create } from 'zustand'

interface TestStore {
  count: number
  name: string
}
const initialState = { count: 0, name: 'test' }

/**
 * ! 注：一定不能在外面直接使用useTestStore.getState() 或者 useTestStore.setState() 等方法
 * ! 否则不会帮你生成对应的cache
 *
 */
const useTestStore = create<TestStore>(() => initialState)

/**
 * 函数层操作state 和cache的方法
 * 使用generateContactCacheStoreFn 或者 generateAccountCacheStoreFn包裹后
 * 后面使用testStore 里面的 setState, getState, setCache, getCache都会帮你生成好对应的cache和state
 * !使用此方法包裹， 是为了后面多账号切换时， 可以统一处理还原cache到store的操作
 * !根据场景使用generateContactCacheStoreFn 或者 generateAccountCacheStoreFn
 * ! （如果使用场景只需要关注AccountId维度，使用generateAccountCacheStoreFn）
 * ! （如果使用场景只需要关注AccountId下面的会话toUserId维度，使用generateContactCacheStoreFn）
 */
export const accountStore = generateAccountCacheStoreFn({ store: useTestStore })
export const contactStore = generateContactCacheStoreFn({ store: useTestStore })

/**
 * circulateCacheMapCallback使用示例
 */

accountStore.circulateCacheMapCallback((accountId, data) => {
  console.log('accountId', accountId)
  console.log('data', data)
})

contactStore.circulateCacheMapCallback((accountId, contactId, data) => {
  console.log('accountId', accountId)
  console.log('contactId', contactId)
  console.log('data', data)
})
// 用于视图层页面显示的store
export const useTestViewStore = () => useTestStore()
