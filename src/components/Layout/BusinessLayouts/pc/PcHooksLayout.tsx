import React from 'react'
import { GridColumnLayout } from '../GridColumnLayout'
import PcMenuLayout from './PcMenuLayout'

interface IProps {
  children: React.ReactNode
}

function PcHooksLayout(props: IProps) {
  return (
    <PcMenuLayout>
      <GridColumnLayout contentRatio="1">
        <div className="overflow-x-hidden border-l border-(--grayscale-black-05) relative">{props.children}</div>
      </GridColumnLayout>
    </PcMenuLayout>
  )
}

export default PcHooksLayout
