import { CommonDialog } from '@/components/CommonDialog'
import React, { useState } from 'react'
import Introduction from './components/Introduction'
import Header from './components/Header'
import Image from 'next/image'
import bgImg from '@/assets/hooks/hooks-cover.png'
import MyHooks from './components/MyHooks/Home'
import TemplatesHooks from './components/TemplateHooks/Home'
import EditHooks from './components/EditHook'

function HooksPage() {
  const [introductionVisible, setIntroductionVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  return (
    <div className="py-(--sizing-named-micro) px-(--sizing-named-mini)">
      <Header openEditHook={() => setEditVisible(true)} />
      <Image
        src={bgImg}
        alt=""
        className="mt-(--sizing-named-micro) cursor-pointer"
        onClick={() => setIntroductionVisible(true)}
      />
      <MyHooks />
      <TemplatesHooks />
      <CommonDialog open={introductionVisible} onOpenChange={setIntroductionVisible}>
        <Introduction />
      </CommonDialog>
      <CommonDialog open={editVisible} onOpenChange={setEditVisible}>
        <EditHooks mode="create" />
      </CommonDialog>
    </div>
  )
}

export default HooksPage
