import { ICreatorDetail } from '@/types/creator'
import { IShareDetail } from '@/types/creator'
import { delay } from '@/utils'

export async function queryCreatorDetailById(creatorId: number | string): Promise<ICreatorDetail> {
  await delay(300)
  console.log('queryCreatorDetailById', creatorId)

  return {
    id: 111,
    name: '6CK10',
    username: '6CK10',
    avatar: '',
    bio: 'K10 from 6C CT. Unnatural tendency to overshare my personal life.',
  }
}

export async function queryCreatorShareDetailById(shareId: number | string): Promise<IShareDetail> {
  await delay(300)
  console.log('queryCreatorShareDetailById', shareId)

  return {
    id: 111,
    type: 'game',
  }
}
