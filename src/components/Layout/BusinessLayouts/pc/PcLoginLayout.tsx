import React from 'react'
import { GridColumnLayout } from '../GridColumnLayout'

interface IProps {
  children: React.ReactNode
}

function PcLoginLayout(props: IProps) {
  return (
    <GridColumnLayout contentRatio="1">
      {/* 居中，占6/16 */}
      <div className="overflow-x-hidden m-auto max-w-6/16 w-full relative">{props.children}</div>
    </GridColumnLayout>
  )
}

export default PcLoginLayout
