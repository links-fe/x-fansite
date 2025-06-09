import Link from 'next/link'
import { InputDemo, IconDemo } from '@/components/XVisionDemo'
import { DemoLayout } from '@/components/Layout/DemoLayout'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <IconDemo></IconDemo>
      <InputDemo></InputDemo>

      <Link href={`/home/page1`}>Page 1</Link>

      <div>
        <div className="flex flex-col items-center p-7 rounded-2xl">
          <div>{/* <img className="size-48 shadow-xl r" alt="" src="/img/cover.png" /> */}</div>
          <div className="flex">
            <span>Class Warfare</span>
            <span>The Anti-Patterns</span>
            <span className="flex">
              <span>No. 4</span>
              <span>·</span>
              <span>2025</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

Page.PcLayout = DemoLayout
Page.MobileLayout = DemoLayout
