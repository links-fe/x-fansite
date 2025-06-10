import { Checkbox, Input, Text } from '@x-vision/design/index.js'
import React from 'react'

interface Iprops {
  updatePrice: (price: number) => void
  updateIsChooseAddPrice: (v: boolean) => void
  price: number
  isChooseAddPrice: boolean
}

function AddPrice(props: Iprops) {
  const { updatePrice, price, updateIsChooseAddPrice, isChooseAddPrice } = props
  return (
    <div className="flex flex-col gap-2">
      {/* checkbox */}
      <div
        className="flex items-center space-x-2"
        onClick={() => {
          updateIsChooseAddPrice(!isChooseAddPrice)
        }}
      >
        <Checkbox checked={isChooseAddPrice}></Checkbox>
        <Text>Add Price</Text>
      </div>
      {/* price */}
      {isChooseAddPrice && (
        <div className="ml-2">
          <Input value={price} onChange={(e) => updatePrice(Number(e.target.value))} />
        </div>
      )}
    </div>
  )
}

export default AddPrice
