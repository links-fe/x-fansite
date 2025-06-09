// import { useGlobalDarkMode, useTC } from '@hbdevs/ia-theme'
import React from 'react'
import { CDN_ASSETS } from '../../common'
import XButton from '@/components/XButton'

interface IAbnormalProps {
  children?: React.ReactNode
  icon?: React.ReactNode
  darkIcon?: React.ReactNode
  text?: React.ReactNode
  iconSrc?: string
  darkIconSrc?: string

  retryText?: string

  onRetry?: () => void
  imgStyle?: React.CSSProperties
  imgClassName?: string
}

function Image(props: { src: string; className?: string; style?: React.CSSProperties }) {
  return <img style={{ width: 120, minHeight: 90 }} src={props.src} alt="" />
}

export function Abnormal(props: IAbnormalProps) {
  // const isDarkMode = useGlobalDarkMode()
  // const TC = useTC()
  const isDarkMode = false
  const TC: any = {}

  if (props.children) return <>{props.children}</>

  function renderIcon() {
    if (isDarkMode) {
      if (props.darkIcon) return props.darkIcon
      if (props.darkIconSrc)
        return <Image src={props.darkIconSrc} style={props.imgStyle} className={props.imgClassName} />
    } else {
      if (props.icon) return props.icon
      if (props.iconSrc) return <Image src={props.iconSrc} style={props.imgStyle} className={props.imgClassName} />
    }

    return <></>
  }

  function renderText() {
    if (props.text) return <div style={{ color: TC['T3'], fontSize: 14 }}>{props.text}</div>
    return <></>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {renderIcon()}
      {renderText()}
      {props.onRetry && (
        <div>
          <XButton
            style={{ marginTop: 10 }}
            onClick={() => {
              props.onRetry?.()
            }}
          >
            {props.retryText || 'Retry'}
          </XButton>
        </div>
      )}
    </div>
  )
}

/**
 * 空状态
 */
function AbnormalEmpty(props: IAbnormalProps) {
  const defaultProps: IAbnormalProps = {
    iconSrc: CDN_ASSETS.STATUS.EMPTY_DATA,
    darkIconSrc: CDN_ASSETS.STATUS.EMPTY_DATA_DARK,
  }
  return <Abnormal {...defaultProps} {...props} />
}

/**
 * 加载失败
 */
function AbnormalRequestError(props: IAbnormalProps) {
  const defaultProps: IAbnormalProps = {
    iconSrc: CDN_ASSETS.STATUS.ERROR_REQUEST,
    darkIconSrc: CDN_ASSETS.STATUS.ERROR_REQUEST_DARK,
  }
  return <Abnormal {...defaultProps} {...props} />
}

function AbnormalLoadMoreError(props: { onRetry?: () => void; text?: string }) {
  const TC: any = {}
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'center',
        backgroundColor: TC['D-B'],
        alignItems: 'center',
        borderRadius: 4,
      }}
    >
      <div style={{ color: TC['D1'], marginLeft: 14, fontSize: 14 }}>{props.text || 'Data request failed'}</div>
      <XButton
        onClick={() => {
          // props.onLoadMore?.()
          props.onRetry?.()
        }}
      >
        Retry
      </XButton>
    </div>
  )
}

function AbnormaConfinedLoadMore(props: { onLoadMore?: () => void; text?: string }) {
  // const TC = useTC()
  return (
    <div style={{ textAlign: 'center' }}>
      {/* <span
        style={{ color: TC['M1'] }}
        onClick={() => {
          props.onLoadMore?.()
        }}
      >
        Load more data
      </span> */}
      <span
        className="cursor-pointer"
        onClick={() => {
          props.onLoadMore?.()
        }}
      >
        Load more data
      </span>
    </div>
  )
}

/**
 * 空状态 且 加载更多
 */
function AbnormalEmptyConfinedLoadMore(props: IAbnormalProps) {
  const defaultProps: IAbnormalProps = {
    iconSrc: CDN_ASSETS.STATUS.EMPTY_DATA,
    darkIconSrc: CDN_ASSETS.STATUS.EMPTY_DATA_DARK,
    text: 'No data loaded. Click the button below to refresh the data.',
    retryText: 'Refresh',
  }
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Abnormal {...defaultProps} {...props} />
      </div>
    </>
  )
}

Abnormal.Empty = AbnormalEmpty
Abnormal.RequestError = AbnormalRequestError
Abnormal.LoadMoreError = AbnormalLoadMoreError
Abnormal.ConfinedLoadMore = AbnormaConfinedLoadMore
Abnormal.EmptyConfinedLoadMore = AbnormalEmptyConfinedLoadMore
