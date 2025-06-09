import { updateChatInputSendData, useChatInputSendDataStore } from '@/models/chat-input-send'
import { InfiniteList } from '@/npm/x-utils-rc'
import { GIFDataListItem, queryGIFList } from '@/services/chatInput'
import { Button, cln, Loading, Search, Text } from '@x-vision/design'
import React, { useEffect, useState } from 'react'
import GifItem from './gitItem'
import { Icon } from '@x-vision/icons'
import { useRequest } from 'ahooks'
import AnimationBox from '@/components/AnimationBox'

interface IProps {
  toUserId: string
}
const limit = 10

function ChatInputGIFList(props: IProps) {
  const { toUserId } = props
  const showGIF = useChatInputSendDataStore((state) => state.showGIF)
  const [gifList, setGifList] = useState<GIFDataListItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [isError, setIsError] = useState(false)
  const [isLoadMoreError, setIsLoadMoreError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [keyword, setKeyword] = useState<string>('')
  const isConfinedLoadMore = false
  // const [pageSize, setPageSize] = useState(10)

  // // 获取gif列表
  const getGIFData = async (v?: string) => {
    setHasMore(true)
    setIsError(false)
    // TODO 从后端获取数据
    try {
      const data = {
        offset: 0,
        limit,
        keyword: v ?? keyword,
      }
      const res = await queryGIFList(data)
      setIsEmpty(!res.data || res.data.length === 0)
      if (res.data) {
        setGifList(res.data)
        setPage(limit)
        setHasMore(res.hasMore)
      }
    } catch (error) {
      console.log('error', error)
      setIsError(true)
    }
  }

  const { run, loading } = useRequest(getGIFData, {
    throttleWait: 3000,
    throttleTrailing: false,
    manual: true,
  })

  useEffect(() => {
    if (showGIF) {
      run()
    }
  }, [showGIF])

  const loadMore = async () => {
    try {
      const data = {
        offset: page || 0,
        limit,
        keyword,
      }
      const res = await queryGIFList(data)
      if (res.data) {
        setGifList((v) => [...v, ...res.data])
        setPage(page + limit)
        setHasMore(res.hasMore)
      }
    } catch (error) {
      console.log('error', error)
      setIsLoadMoreError(true)
    }
  }

  const onCloseGIF = () => {
    updateChatInputSendData(toUserId, {
      showGIF: false,
    })
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getGIFData(keyword)
    }
  }

  return (
    <AnimationBox show={showGIF || false}>
      <div className="pb-2 flex flex-col gap-2">
        <div className=" flex items-center pl-3 pr-12 gap-2" dom-id="chat-input-gif-search">
          <Search
            placeholder="Search gifs"
            size="moderate"
            className="rounded-full!"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            onKeyDown={handleKeyDown}
          />
          <Button shape="circle" size="medium" onClick={onCloseGIF}>
            <Icon icon="x:Cancel01StyleSolid" />
          </Button>
        </div>
        <InfiniteList<GIFDataListItem>
          type="horizontalRight"
          hasMore={hasMore}
          onLoadMore={loadMore}
          onReload={getGIFData}
          renderItem={(v, i) => {
            // 这里的id可能为frontendId, 也可能为服务端id
            return <GifItem key={v.id} item={v} index={i} toUserId={toUserId} />
          }}
          data={gifList}
          reloading={loading}
          isError={isError}
          isEmpty={isEmpty}
          isLoadMoreError={isLoadMoreError}
          isConfinedLoadMore={isConfinedLoadMore}
          spin={
            <div className="w-full h-full flex items-center justify-center">
              <Loading />
            </div>
          }
          className="scrollbar-hide flex px-2 gap-1"
          renderAbnormalRequestError={() => (
            <div className="w-full h-full flex items-center justify-center gap-2">
              <Icon icon="x:AlertCircleStyleStroke" fontSize={20} color="rgba(234, 99, 87, 1)" />
              <Text size="caption1" strong className="text-[#FD574F]">
                Error loading GIFs
              </Text>
            </div>
          )}
          style={{ height: '120px' }}
        />
      </div>
    </AnimationBox>
  )
}

export default ChatInputGIFList
