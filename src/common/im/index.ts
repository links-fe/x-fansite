import { XImClient } from '@/npm/x-im'
import { ON_IM_MESSAGE } from './dealImMessage'
import { request } from '../request'
import { getActiveAccountId } from '@/models/user'

export const xim = new XImClient({
  services: {
    queryNimToken: async () => {
      return request.get('/api/im/account', {
        params: {
          userId: getActiveAccountId(),
        },
      })
    },
  },
})

xim.onMessage((message) => {
  ON_IM_MESSAGE(message)
})

xim.onError((error) => {
  console.error(error)
})
