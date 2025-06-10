'use client'

import { PageHeader } from '@/components/PageHeader/PageHeader'
import { PageProps } from '@/types/page'
import { cln } from '@x-vision/design'
import { useRouter } from 'next/router'

export default function AboutDetail({ title = `Terms & safety`, className, onBack, ...props }: PageProps) {
  const router = useRouter()
  const type = router.query.type as string

  if (!type) return 404
  return (
    <div className={cln('relative', className)}>
      <PageHeader title={title} back={onBack} />
      <div className="flex flex-col gap-(--named-small) p-(--named-small)">
        <div className="typography-text-body1-strong">If a sentence has a long name, it will wrap to the next line</div>
        <div className="typography-numbers-body1-base">
          <p>
            After submitting the request, you have 14 days to log back into your account to restore it before it's
            permanently deleted.
          </p>
          <br />
          <p>The following will be deleted as well:</p>
          <ul
            role="list"
            className="list-none marker:w-[1.5em] [&>li]:before:content-['•'] [&>li]:before:w-[1.5em] [&>li]:before:inline-flex [&>li]:before:justify-center"
          >
            <li>All uploaded media</li>
            <li>All messages</li>
            <li>All data related to the account</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
