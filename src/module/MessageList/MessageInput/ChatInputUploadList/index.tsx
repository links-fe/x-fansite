'use client'
import {
  clearChatItemUploadNoFinishCache,
  getCurrentChatUploadList,
  setCurrentChatFinalTime,
  setCurrentChatUploadList,
  useCurrentChatToolUploadList,
} from '@/models/chatUploadData'
import ChatInputUploadCard from './card'
import { useEffect, useRef } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { uploadSceneEnum, videoTypes } from '@/constants/upload'
import { Preview, useMediaPreview } from '@/npm/x-utils-rc'

interface IProps {
  toUserId: string
  userId: string
}
const ChatInputUploadList = ({ toUserId, userId }: IProps) => {
  const list = useCurrentChatToolUploadList()
  const uploadList = useRef(null)

  const { open, setOpen, slides, openIdx, openPreviewPop } = useMediaPreview({
    mediaList:
      list?.map((v) => ({
        src: v.fileUrl,
        type: videoTypes.includes(`.${v.fileType}`) ? 'video' : undefined,
        id: v.key,
      })) || [],
    toUserId: toUserId,
  })

  useEffect(() => {
    setCurrentChatFinalTime({
      subId: toUserId,
      userId,
      finalTime: null,
    })
    return () => {
      setCurrentChatFinalTime({
        subId: toUserId,
        userId,
        finalTime: Date.now(),
      })
      clearChatItemUploadNoFinishCache({
        subId: toUserId,
        userId,
      })
    }
  }, [toUserId, userId])

  return (
    <>
      <ReactSortable
        list={list?.map?.((v) => {
          return {
            id: v.key,
            ...v,
          }
        })}
        delayOnTouchStart={true}
        delay={200}
        setList={(newList) => {
          console.log('newList', newList)
          // 获取所有素材
          const allMediaList = getCurrentChatUploadList({ userId, subId: toUserId })
          const oldList = allMediaList?.filter((v) => v.scene === uploadSceneEnum.chatTool)
          // 如果是一样的顺序，不做任何操作
          if (oldList.map((v) => v.key).join(',') === newList.map((v) => v.key).join(',')) return
          // 找到音频
          const audioData = allMediaList?.filter((v) => v.scene === uploadSceneEnum.chatVoice)
          // 找到聊天举报
          const chatReportFile = allMediaList?.filter((v) => v.scene === uploadSceneEnum.chatReport)
          // 将音频合并到新排序数组中
          const newMediaList = [...chatReportFile, ...newList, ...audioData]
          setCurrentChatUploadList({
            subId: toUserId,
            userId,
            list: newMediaList,
          })
        }}
        className="w-full overflow-x-auto pr-(--sizing-named-micro)  whitespace-nowrap"
        ref={uploadList}
      >
        {list?.map?.((item, i) => {
          return (
            <ChatInputUploadCard
              key={item?.key}
              data={item}
              className="inline-block"
              openPreviewPop={() => openPreviewPop(i)}
            ></ChatInputUploadCard>
          )
        })}
      </ReactSortable>
      <Preview open={open} onOpenChange={setOpen} slides={slides} initialSlide={openIdx} />
    </>
  )
}
export default ChatInputUploadList
