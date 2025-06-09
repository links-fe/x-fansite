import { ContactCacheStore } from '../account/cantact/store'
import { AccountCacheStore } from '../account/store'
import {
  addGlobalAccountCache,
  addGlobalChatCache,
  restoreGlobalAccountCache,
  restoreGlobalChatCache,
  removeGlobalAccountCache,
} from '../cache'

describe('Global Cache Management', () => {
  // Mock instances with proper Jest mock functions
  const mockAccountCache = {
    getCache: jest.fn(),
    setState: jest.fn(),
    hasCache: jest.fn(),
    removeCache: jest.fn(),
  } as unknown as AccountCacheStore<unknown> & {
    getCache: jest.Mock
    setState: jest.Mock
    hasCache: jest.Mock
    removeCache: jest.Mock
  }

  const mockChatCache = {
    getCache: jest.fn(),
    setState: jest.fn(),
    hasCache: jest.fn(),
    removeCache: jest.fn(),
  } as unknown as ContactCacheStore<unknown> & {
    getCache: jest.Mock
    setState: jest.Mock
    hasCache: jest.Mock
    removeCache: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addGlobalAccountCache', () => {
    it('should add account cache instance to global array', () => {
      addGlobalAccountCache({
        key: 'account1',
        instance: mockAccountCache,
      })

      // Test by resetting cache to verify instance was added
      const mockCache = { test: 'data' }
      mockAccountCache.getCache.mockReturnValue(mockCache)

      restoreGlobalAccountCache('account1')
      expect(mockAccountCache.getCache).toHaveBeenCalledWith('account1')
      expect(mockAccountCache.setState).toHaveBeenCalledWith('account1', mockCache)
    })
  })

  describe('addGlobalChatCache', () => {
    it('should add chat cache instance to global array', () => {
      addGlobalChatCache({
        key: 'fans1',
        instance: mockChatCache,
      })

      // Test by resetting cache to verify instance was added
      const mockCache = { test: 'data' }
      mockChatCache.getCache.mockReturnValue(mockCache)

      restoreGlobalChatCache('account1', 'fans1')
      expect(mockChatCache.getCache).toHaveBeenCalledWith('account1', 'fans1')
      expect(mockChatCache.setState).toHaveBeenCalledWith('account1', 'fans1', mockCache)
    })
  })

  describe('restoreGlobalAccountCache', () => {
    it('should reset account cache when cache exists', () => {
      addGlobalAccountCache({
        key: 'account1',
        instance: mockAccountCache,
      })
      const mockCache = { test: 'data' }
      mockAccountCache.getCache.mockReturnValue(mockCache)

      restoreGlobalAccountCache('account1')

      expect(mockAccountCache.getCache).toHaveBeenCalledWith('account1')
      expect(mockAccountCache.setState).toHaveBeenCalledWith('account1', mockCache)
    })

    it('should not reset account cache when cache does not exist', () => {
      addGlobalAccountCache({
        key: 'account1',
        instance: mockAccountCache,
      })
      mockAccountCache.getCache.mockReturnValue(undefined)

      restoreGlobalAccountCache('account1')

      expect(mockAccountCache.getCache).toHaveBeenCalledWith('account1')
      expect(mockAccountCache.setState).not.toHaveBeenCalled()
    })
  })

  describe('restoreGlobalChatCache', () => {
    it('should reset chat cache when cache exists', () => {
      addGlobalChatCache({
        key: 'fans1',
        instance: mockChatCache,
      })
      const mockCache = { test: 'data' }
      mockChatCache.getCache.mockReturnValue(mockCache)

      restoreGlobalChatCache('account1', 'fans1')

      expect(mockChatCache.getCache).toHaveBeenCalledWith('account1', 'fans1')
      expect(mockChatCache.setState).toHaveBeenCalledWith('account1', 'fans1', mockCache)
    })

    it('should not reset chat cache when cache does not exist', () => {
      addGlobalChatCache({
        key: 'fans1',
        instance: mockChatCache,
      })
      mockChatCache.getCache.mockReturnValue(undefined)

      restoreGlobalChatCache('account1', 'fans1')

      expect(mockChatCache.getCache).toHaveBeenCalledWith('account1', 'fans1')
      expect(mockChatCache.setState).not.toHaveBeenCalled()
    })
  })

  describe('removeGlobalAccountCache', () => {
    beforeEach(() => {
      addGlobalAccountCache({
        key: 'account1',
        instance: mockAccountCache,
      })
      addGlobalChatCache({
        key: 'fans1',
        instance: mockChatCache,
      })
    })

    it('should remove account cache and related instances', () => {
      mockAccountCache.hasCache.mockReturnValue(false)
      mockChatCache.hasCache.mockReturnValue(false)

      removeGlobalAccountCache('account1')

      expect(mockAccountCache.removeCache).toHaveBeenCalledWith('account1')
      expect(mockAccountCache.hasCache).toHaveBeenCalledWith('account1')
    })

    it('should keep instances that still have cache for other accounts', () => {
      mockAccountCache.hasCache.mockReturnValue(true)
      mockChatCache.hasCache.mockReturnValue(true)

      removeGlobalAccountCache('account1')

      expect(mockAccountCache.removeCache).toHaveBeenCalledWith('account1')
      expect(mockAccountCache.hasCache).toHaveBeenCalledWith('account1')
    })
  })
})
