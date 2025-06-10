import { Drawer } from '@x-vision/design/index.js'
import React from 'react'
import { CommonDrawerProps } from './type'
import classNames from 'classnames'

function CommonDrawerPage(props: CommonDrawerProps) {
  const { children, direction } = props
  return (
    <Drawer
      className={classNames('!max-h-[95vh] !h-[95vh]', direction === 'right' && '!h-screen !max-h-[100vh] !w-screen')}
      {...props}
    >
      <div className="overflow-y-hidden">{children}</div>
    </Drawer>
  )
}

export default CommonDrawerPage
