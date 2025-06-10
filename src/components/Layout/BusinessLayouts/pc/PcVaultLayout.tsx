import React from 'react'
import { GridColumnLayout } from '../GridColumnLayout'
import PcMenuLayout from './PcMenuLayout'
interface IProps {
  children: React.ReactNode
}

function PcVaultLayout(props: IProps) {
  return (
    <PcMenuLayout>
      <GridColumnLayout contentRatio="8:8">
        {/* <SettingPage /> */}
        <div className="overflow-x-hidden border-l border-(--grayscale-black-05) relative">{props.children}</div>
      </GridColumnLayout>
    </PcMenuLayout>
  )
}

export default PcVaultLayout
