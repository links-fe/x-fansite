import { queryMessageHistoryVaultList, QueryMessageHistoryVaultListParams } from '@/services/chatInput'
import { Loading, Text } from '@x-vision/design/index.js'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { IItem, MediaListType, MediaType, SendTypeEnum } from './type'
import { InfiniteList, Preview, useMediaPreview, usePaging } from '@/npm/x-utils-rc'
import Empty from './empty'
import MediaHistoryItem from './MediaHistoryItem'
import { useMount } from '@/hooks/useMount'
interface IProps {
  toUserId: string
  sendType: SendTypeEnum
  mediaType: MediaType
  free: boolean | undefined
}

export default function MediaHistoryList(props: IProps) {
  const { toUserId, sendType, mediaType, free } = props

  const isMount = useMount()

  const { open, setOpen, slides, openIdx, openPreviewPop } = useMediaPreview({
    mediaList: [],
    toUserId: toUserId,
    messageId: '',
  })

  const getRequestParams = (offset?: string) => {
    return {
      toUserId: toUserId,
      send: sendType === SendTypeEnum.Sent,
      vaultType: mediaType,
      free: free,
      cursor: offset,
      limit: 10,
    }
  }

  const paging = usePaging<MediaListType, QueryMessageHistoryVaultListParams>({
    queryParams: getRequestParams(),
    service: async (params, option) => {
      const res = await queryMessageHistoryVaultList(params)
      const oldData = option.getData()
      option.setData(groupByDay(oldData, res.data))
      if (!res.hasMore) {
        option.end()
      }
      option.setParams({
        cursor: res.data?.at(-1)?.id || '',
      })
    },
  })

  useEffect(() => {
    paging.reload(getRequestParams())
  }, [toUserId, sendType, mediaType, free])

  // 新增分组函数
  const groupByDay = (oldData: MediaListType[], list: IItem[]) => {
    // 将老数据(paging.data)中的items提取出来
    const oldItems = oldData?.flatMap((group) => group.items) || []

    // 合并新旧数据
    const combinedList = [...oldItems, ...list]

    const now = dayjs()
    const grouped: Record<string, IItem[]> = {
      Today: [],
      'Last 7 days': [],
      'Over 7 days': [],
    }

    combinedList?.forEach((item) => {
      const itemDate = dayjs(item.gmtCreate)
      const diffHours = now.diff(itemDate, 'hour')
      const diffDays = now.diff(itemDate, 'day')

      if (diffHours < 24) {
        grouped['Today'].push(item)
      } else if (diffDays < 7) {
        grouped['Last 7 days'].push(item)
      } else {
        grouped['Over 7 days'].push(item)
      }
    })

    return Object.entries(grouped)
      .filter(([_, items]) => items.length > 0) // 过滤空分组
      .map(([groupName, items]) => ({
        items,
        displayDate: groupName,
      }))
  }

  // 打开预览弹窗
  const openViewPop = async (item: IItem) => {
    if (!item?.unlock && !item?.free && sendType === SendTypeEnum.Received) {
      // 未解锁
      return
    }
    if (!item?.vaultData?.thumbMidUrl) return
    if (item.vaultData.type === 'audio') {
      if (!item?.vaultData?.avUrl) {
        // 语音不存在播放地址
        return
      }
      // 语音预览
      return
    }
    const list = await openPreviewPop(
      0,
      [
        {
          src: item.vaultData.src,
          id: item.vaultData.id,
          type: item.vaultData.type === 'video' ? 'video' : undefined,
        },
      ],
      item.msgId,
    )
    if (list) {
      // 改变数据   TODO 这里直接改的数据 不知道有没有问题
      item.vaultData = {
        ...item.vaultData,
        src: list[0]?.src,
      }
    }
  }

  const renderItem = (v: MediaListType) => {
    return (
      <div className="mt-3" key={v.displayDate}>
        <Text size="caption1" strong>
          {v.displayDate}
        </Text>
        <div className="grid grid-cols-3 gap-1 mt-3">
          {v.items.map((item: IItem) => {
            return (
              <div key={item.id} onClick={() => openViewPop(item)}>
                <MediaHistoryItem item={item} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      {isMount && (
        <InfiniteList<MediaListType>
          className="px-4 pt-4 mt-2 pb-6 flex-1"
          hasMore={paging.hasMore}
          onLoadMore={paging.loadMore}
          onReload={() => paging.reload(getRequestParams())}
          renderItem={(v) => {
            return renderItem(v)
          }}
          data={paging.data}
          reloading={paging.reloading}
          isError={paging.isError}
          isEmpty={paging.isEmpty}
          isLoadMoreError={paging.isLoadMoreError}
          isConfinedLoadMore={paging.isConfinedLoadMore}
          renderInitSpin={() => (
            <div className="w-full h-[80vh] flex items-center justify-center">
              <Loading />
            </div>
          )}
          spin={
            <div className="flex flex-col justify-center items-center flex-1 w-full">
              <Loading />
            </div>
          }
          renderAbnormalEmptyConfinedLoadMore={() => <Empty sendType={sendType} mediaType={mediaType} />}
          renderAbnormalEmpty={() => <Empty sendType={sendType} mediaType={mediaType} />}
          // renderAbnormalRequestError={() => <ChatListEmptyError scene="initError" onReload={chatListReload} />}
          // renderAbnormalLoadMoreError={() => (
          //   <ChatListEmptyError scene="loadMoreError" onReload={chatListLoadMoreRetry} />
          // )}
        />
      )}
      <Preview open={open} onOpenChange={setOpen} slides={slides} initialSlide={openIdx} />
    </>
  )
}
