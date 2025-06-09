'use client'
import React from 'react'
const TermsAndConditions = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-(--sizing-named-small) text-(--element-emphasis-00) typography-text-heading1-strong mb-(--sizing-named-medium)">
        Terms and conditions
      </div>

      <div className="px-(--sizing-named-small) text-(--element-emphasis-00) typography-text-body1-base flex-1 pb-10 overflow-y-auto">
        {new Array(1000).fill(null).map((_, index) => {
          return <div key={index}>{index}</div>
        })}
      </div>
    </div>
  )
}
export default TermsAndConditions
