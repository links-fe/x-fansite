'use client'

interface RouteLoadingProps {
  children?: React.ReactNode
}

export function RouteLoading(props: RouteLoadingProps) {
  function renderChildren() {
    if (props.children) {
      return props.children
    }
    return <>Loading...</>
  }
  return <div>{renderChildren()}</div>
}
