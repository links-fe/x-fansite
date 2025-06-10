import React from 'react'
import { GridColumnLayout } from '../GridColumnLayout'
import { AppLayout } from '../../AppLayout'

interface IProps {
  children: React.ReactNode
}

function PcEmptyLayout(props: IProps) {
  return (
    <AppLayout>
      <GridColumnLayout contentRatio="1">
        <div className="overflow-x-hidden relative">{props.children}</div>
      </GridColumnLayout>
    </AppLayout>
  )
}

export default PcEmptyLayout
