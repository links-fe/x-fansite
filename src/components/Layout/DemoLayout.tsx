'use client'

import { IS_TEST_MODE } from '@/constants'
import Link from 'next/link'

export function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // console.log("IS_TEST_MODE", IS_TEST_MODE);
  const { innerWidth: width, innerHeight: height } = window
  const isPortrait = width < height
  if (isPortrait) return children

  if (!IS_TEST_MODE) return <></>
  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <div style={{ width: '200px' }}>
        <ul>
          <li>
            <Link href="/--demo/design-test">Design Test</Link>
          </li>
        </ul>
      </div>
      <div style={{ border: '1px solid black', height: '100%', width: 'calc(100% - 200px)' }}>{children}</div>
    </div>
  )
}
