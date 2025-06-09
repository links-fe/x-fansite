import { useState } from 'react'
import { SlideType } from '.'
import { XImMessageMediaType } from '@/npm/x-im'
import { queryMediaViewUrl } from '@/services/message'

interface MediaList extends SlideType {
  id: string
}

interface IProps {
  mediaList: MediaList[]
  toUserId: string
  messageId?: string
}
export function useMediaPreview(props: IProps) {
  const { mediaList, toUserId, messageId } = props
  const [open, setOpen] = useState(false)
  const [slides, setSlides] = useState<SlideType[]>(
    mediaList.map((v) => ({
      ...v,
      loading: v.src ? false : true,
    })) || [],
  )
  const [openIdx, setOpenIdx] = useState<number>(0)

  const openPreviewPop = async (i: number, list?: MediaList[], id?: string) => {
    const msgId = id || messageId
    const mediaViewList = list || mediaList
    setSlides(
      mediaViewList.map((v) => ({
        ...v,
        loading: v.src ? false : true,
      })) || [],
    )
    setOpen(true)
    setOpenIdx(i)
    // 已经请求过着不返回数据  或者不是消息id
    if (mediaViewList?.some((v) => v.src) || !msgId) return
    // 请求接口获取素材原地址
    try {
      const data = {
        vaultIds: mediaViewList?.map((v) => v.id).join(','),
        toUserId: toUserId,
        msgId: msgId,
      }
      const res = await queryMediaViewUrl(data)
      if (!res) return
      const list = mediaViewList?.map((v) => ({
        ...v,
        src: res[v.id]?.url,
      }))
      setSlides(
        list?.map((v) => ({
          ...v,
          loading: false,
        })) || [],
      )
      return list
    } catch (error) {
      console.log(error)
    }
  }

  return {
    open,
    setOpen,
    openIdx,
    setOpenIdx,
    slides,
    setSlides,
    openPreviewPop,
  }
}
