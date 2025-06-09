'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Image from 'next/image'
import XButton from '@/components/XButton'
import errorLoadingData from '@/assets/error-loading-data.png'

export default function Error(props?: { error?: Error & { digest?: string }; reset?: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(props?.error)
  }, [props?.error])

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div>
        <div className="flex items-center justify-center flex-col">
          <Image src={errorLoadingData} width={80} height={80} alt="error.icon"></Image>
          <div className="mt-(--sizing-named-small) text-(--element-emphasis-01) typography-text-body1-base">
            Error loading data root
          </div>
        </div>
        <div className="mt-(--sizing-named-medium) flex items-center justify-center">
          <XButton
            color="primary"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => {
                location.reload()
              }
            }
          >
            Reload
          </XButton>
        </div>
      </div>
    </div>
  )
}
