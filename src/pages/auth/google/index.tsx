'use client'
import { PageLoading } from '@/components/PageLoading'
import { useGoogleAuthCallback } from '@/npm/x-google-auth-login'

export default function Page() {
  useGoogleAuthCallback()
  return (
    <div className="w-full h-full flex items-center justify-center">
      <PageLoading></PageLoading>
    </div>
  )
}
