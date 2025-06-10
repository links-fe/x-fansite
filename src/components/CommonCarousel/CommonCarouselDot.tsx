import classNames from 'classnames'
import React from 'react'

interface Iprops {
  isActive?: boolean
  onClick?: () => void
}
function CommonCarouselDot(props: Iprops) {
  const { isActive, onClick } = props
  return (
    <div
      className={classNames([
        'w-(--sizing-named-micro) h-(--sizing-named-micro) bg-(--element-emphasis-03) rounded-full',
        isActive && '!bg-(--element-emphasis-00)',
      ])}
      onClick={onClick}
    ></div>
  )
}

export default CommonCarouselDot
