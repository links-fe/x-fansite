import React from 'react'
import { GridColumnLayout } from '../GridColumnLayout'
import PcMenuLayout from './PcMenuLayout'
import MorePage from '@/views/more'
interface IProps {
  children: React.ReactNode
}

function PcSettingLayout(props: IProps) {
  return (
    <PcMenuLayout>
      <GridColumnLayout contentRatio="6:10">
        <MorePage />
        <div className="overflow-x-hidden border-l border-(--grayscale-black-05) relative">{props.children}</div>
      </GridColumnLayout>
    </PcMenuLayout>
  )
}

export default PcSettingLayout
