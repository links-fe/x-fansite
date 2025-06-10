'use client'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <div>Account</div>

      <Link href={`/account/setting`}>Setting</Link>
    </div>
  )
}
