'use client'

import { queryCreatorDetailById, queryCreatorShareDetailById } from '@/services/creator'
import { ICreatorDetail, IShareDetail } from '@/types/creator'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import Image from 'next/image'
import bgImg from '@/assets/creator-share/creator-bg-default.jpeg'
import creatorAvatarImg from '@/assets/creator-share/creator-avatar-demo.png'
import postImg from '@/assets/creator-share/creator-post-demo.png'
import { Input } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { loginGuard } from '@/models/user'
import XButton from '@/components/XButton'

export function CreatorSharePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>() || {}

  const searchParams = useSearchParams()
  const creatorId = id
  const shareId = searchParams?.get('id')

  const [creatorData, setCreatorData] = useState<ICreatorDetail>()
  const [shareInfo, setShareInfo] = useState<IShareDetail>()

  async function reloadCreatorData() {
    if (!creatorId || !shareId) {
      // TODO: 异常处理
      router.push('/')
      return
    }
    const [creatorData, shareInfo] = await Promise.all([
      queryCreatorDetailById(creatorId),
      queryCreatorShareDetailById(shareId),
    ])
    setCreatorData(creatorData)
    setShareInfo(shareInfo)
  }

  useEffect(() => {
    reloadCreatorData()
  }, [])

  async function handleOpenChatPage() {
    await loginGuard()
    router.push(`/chat/${creatorId}`)
  }

  if (!creatorData || !shareInfo) {
    return <div>loading... -- request creator</div>
  }
  return (
    <div className={styles['creator-share-page']}>
      <div className={styles['creator-share-page__bg']}>
        <Image src={bgImg} alt="" />

        <div className={styles['page-tabbar']}>
          <div>
            <XButton shape="circle">
              <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} color="#fff" />
            </XButton>
          </div>
          <div className={styles['tabbar-right']}>
            <XButton shape="circle">
              <Icon icon="x:Share03StyleSolid" fontSize={20} color="#fff" />
            </XButton>
            <XButton shape="circle">
              <Icon icon="x:MoreHorizontalCircle01StyleSolid" fontSize={20} color="#fff" />
            </XButton>
          </div>
        </div>
      </div>
      <div className={styles['creator-share-page__content']}>
        <div className={styles['creator-btn-wrap']}>
          <XButton color="primary" className={styles['creator-follow']}>
            Follow
          </XButton>
          <XButton shape="pill">
            <Icon icon="x:Store02StyleStroke" fontSize={20} />
          </XButton>
        </div>
        <div className={styles['creator-avatar']}>
          <Image src={creatorAvatarImg} alt="" />
        </div>
        <div className={styles['creator-info']}>
          <div className={styles['creator-name']}>
            6CK10
            <Icon icon="x:CheckmarkBadge01StyleSolid" className={styles['creator-name-icon']} />
            <span className={styles['creator-name-id']}>@6ck10</span>
          </div>
          <div className={styles['creator-desc']}>
            K10 from 6C CT. Unnatural tendency to overshare my personal life.
          </div>
        </div>
        <div className={styles['post-wrap']}>
          <div className={styles['post-pointed']} />
          <div className={styles['post-info']}>
            <div className={styles['post-content']}>
              <div className={styles['post-text']}>
                I&apos;ve just started my profile on [x]. I will try my best to respond to all my fans! XOXO
              </div>
              <div className={styles['post-time']}>Posted yesterday</div>
            </div>
            <div className={styles['post-video']}>
              <Image src={postImg} alt="" />
              <div className={styles['post-video-time']}>
                <Icon icon="x:PlayStyleSolid" color="#fff" />
                <span>00:10</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['dots-wrap']}>
          <div className={styles['dot-item']} />
          <div className={styles['dot-item']} />
          <div className={styles['dot-item']} />
        </div>

        <div className={styles['chat-tips']}>
          <div className={styles['chat-avatar']}>
            <Image src={creatorAvatarImg} alt="" />
          </div>
          <div className={styles['chat-tips-text']}>Type a message to chat with 6CK10</div>
        </div>

        <div
          className={styles['chat-input']}
          onClick={() => {
            handleOpenChatPage()
          }}
        >
          <XButton shape="circle" className={styles['chat-input-btn']}>
            <Icon icon="x:PlusSignStyleSolid" fontSize={16} />
          </XButton>
          <Input type="text" placeholder="Type a message" />
        </div>
      </div>
    </div>
  )
}
export default function Page() {
  return <></>
}
