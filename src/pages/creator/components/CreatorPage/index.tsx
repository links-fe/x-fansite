'use client'

import { useParams } from 'next/navigation'

export function CreatorPage() {
  const { id } = useParams<{ id: string }>() || {}

  return (
    <div>
      <div>Creator {id}</div>
    </div>
  )
}

export default CreatorPage
