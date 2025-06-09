import { useState } from 'react'

export function useUpdate() {
  const [, setTimes] = useState(0)
  function update() {
    setTimes((prev) => prev + 1)
  }

  return update
}
