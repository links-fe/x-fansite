'use client'

import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ErrorAlert } from '@/components/Setting/ErrorAlert'
import { ProfileFieldInput } from '@/components/Setting/UserProfileFieldInput'
import { postApiAccountSettingFeedback } from '@/services/setting'
import { Button, Cell, CellGroup, cln, Textarea } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'

export default function HelpFeedback({ title = PAGE_NAMES.FEEDBACK, className, onBack, ...props }: PageProps) {
  const router = useRouter()

  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    try {
      setLoading(true)
      const res = await postApiAccountSettingFeedback({ feedback: value })
      if (!res?.success) return
      router.back()
    } catch (error) {
      console.error(error)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={cln('relative', className)}>
      <PageHeader title={title} back={onBack} />
      <div className="flex flex-col p-(--named-small)">
        <div className="typography-text-body1-strong mb-(--named-micro)">Help us make the X better for you</div>
        <ProfileFieldInput
          type="textarea"
          placeholder="Write your feedback"
          className="p-0"
          rows={5}
          value={value}
          maxLength={300}
          error={error}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        />

        <Button className="mt-(--named-medium)" size="huge" color="primary" loading={loading} onClick={submit}>
          Send feedback
        </Button>
      </div>
    </div>
  )
}

HelpFeedback.PcLayout = PcMenuLayout
HelpFeedback.MobileLayout = MobileNoTabbarLayout
