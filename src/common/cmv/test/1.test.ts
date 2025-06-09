import { create } from 'zustand'
import { generateAccountCacheStoreFn, generateContactCacheStoreFn } from '../index'
import * as messageModel from '@/models/message/model'
import * as userModel from '@/models/user'

// Mock external dependencies
jest.mock('@/models/message/model', () => ({
  getActiveContactId: jest.fn(),
}))

jest.mock('@/models/user', () => ({
  getActiveAccountId: jest.fn(),
}))

// Test store interface
interface TestStore {
  count: number
  name: string
}

describe('View Store Functions', () => {
  const initialState = { count: 0, name: 'test' }
  const useTestStore = create<TestStore>(() => initialState)
  const useTestStore1 = create<TestStore>(() => initialState)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateAccountCacheStoreFn', () => {
    let accountViewStore: ReturnType<typeof generateAccountCacheStoreFn<TestStore>>

    beforeEach(() => {
      accountViewStore = generateAccountCacheStoreFn({ store: useTestStore })
      jest.mocked(userModel.getActiveAccountId).mockReturnValue('account1')
    })

    it('should return an object with all required methods', () => {
      expect(accountViewStore).toHaveProperty('setState')
      expect(accountViewStore).toHaveProperty('getState')
      expect(accountViewStore).toHaveProperty('getCache')
      expect(accountViewStore).toHaveProperty('setCache')
    })

    it('should get correct initial state and cache', () => {
      expect(accountViewStore.getState('account1')).toEqual(initialState)
      expect(accountViewStore.getCache('account1')).toEqual(initialState)
    })

    it('should not update state when id is not provided', () => {
      const newData = { count: 1 }
      accountViewStore.setState('', newData)
      expect(accountViewStore.getState('account1')).toEqual(initialState)
    })

    it('should update state when setting state for current account', () => {
      const newData = { count: 1 }
      accountViewStore.setState('account1', newData)
      expect(accountViewStore.getCache('account1')).toMatchObject(newData)
    })

    it('should only update cache when setting state for different account', () => {
      const initialCount = accountViewStore.getState('account1').count
      const newData = { count: 2 }

      accountViewStore.setState('account2', newData)
      expect(accountViewStore.getState('account1').count).toBe(initialCount)
      expect(accountViewStore.getCache('account2')).toMatchObject(newData)
    })

    it('should not update state when silence is true', () => {
      const initialCount = accountViewStore.getState('account1').count
      accountViewStore.setState('account1', { count: 3 }, true)
      expect(accountViewStore.getState('account1').count).toBe(initialCount)
    })

    it('should maintain separate caches for different accounts', () => {
      const data1 = { count: 1, name: 'cache1' }
      const data2 = { count: 2, name: 'cache2' }

      accountViewStore.setCache('account1', data1)
      accountViewStore.setCache('account2', data2)

      expect(accountViewStore.getCache('account1')).toMatchObject(data1)
      expect(accountViewStore.getCache('account2')).toMatchObject(data2)
    })
  })

  describe('generateContactCacheStoreFn', () => {
    let fansViewStore: ReturnType<typeof generateContactCacheStoreFn<TestStore>>

    beforeEach(() => {
      fansViewStore = generateContactCacheStoreFn({ store: useTestStore1 })
      jest.mocked(userModel.getActiveAccountId).mockReturnValue('account1')
      jest.mocked(messageModel.getActiveContactId).mockReturnValue('fans1')
    })

    it('should return an object with all required methods', () => {
      expect(fansViewStore).toHaveProperty('setState')
      expect(fansViewStore).toHaveProperty('getState')
      expect(fansViewStore).toHaveProperty('getCache')
      expect(fansViewStore).toHaveProperty('setCache')
    })

    it('should get correct initial state and cache', () => {
      expect(fansViewStore.getState('account1', 'fans1')).toEqual(initialState)
      expect(fansViewStore.getCache('account1', 'fans1')).toEqual(initialState)
    })

    it('should not update state when ids are not provided', () => {
      const newData = { count: 1 }
      fansViewStore.setState('', '', newData)
      expect(fansViewStore.getState('account1', 'fans1')).toEqual(initialState)
    })

    it('should update state when setting state for current account-fans pair', () => {
      const newData = { count: 1 }
      fansViewStore.setState('account1', 'fans1', newData)
      expect(fansViewStore.getCache('account1', 'fans1')).toMatchObject(newData)
    })

    it('should only update cache when setting state for different account-fans pair', () => {
      const initialCount = fansViewStore.getState('account1', 'fans1').count
      const newData = { count: 2 }

      fansViewStore.setState('account2', 'fans2', newData)
      expect(fansViewStore.getState('account1', 'fans1').count).toBe(initialCount)
      expect(fansViewStore.getCache('account2', 'fans2')).toMatchObject(newData)
    })

    it('should not update state when silence is true', () => {
      const initialCount = fansViewStore.getState('account1', 'fans1').count
      fansViewStore.setState('account1', 'fans1', { count: 3 }, true)
      expect(fansViewStore.getState('account1', 'fans1').count).toBe(initialCount)
    })

    it('should maintain separate caches for different account-fans pairs', () => {
      const data1 = { count: 1, name: 'cache1' }
      const data2 = { count: 2, name: 'cache2' }

      fansViewStore.setCache('account1', 'fans1', data1)
      fansViewStore.setCache('account2', 'fans2', data2)

      expect(fansViewStore.getCache('account1', 'fans1')).toMatchObject(data1)
      expect(fansViewStore.getCache('account2', 'fans2')).toMatchObject(data2)
    })
  })
})
