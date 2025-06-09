import { useEffect, useRef, useState } from 'react'

interface PropsType {
  children: React.ReactNode
  placeholder?: React.ReactNode

  className?: string
  style?: React.CSSProperties
}

export function LazyMount(props: PropsType) {
  const [lock, setLock] = useState(true)
  const placeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!placeRef.current) return
    const io = new IntersectionObserver((entries) => {
      const [entrie] = entries
      if (entrie.isIntersecting) {
        setLock(false)
        io.disconnect()
      }
    })
    io.observe(placeRef.current)

    return () => {
      io.disconnect()
    }
  }, [])

  console.log('lock', lock)

  if (lock) {
    return (
      <div style={props.style} className={props.className} ref={placeRef}>
        {props.placeholder || <></>}
      </div>
    )
  }

  return props.children
}
