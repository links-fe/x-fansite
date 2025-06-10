import React, { useState } from 'react'
import AddPrice from './AddPrice'
import { Avatar, Button, Checkbox, Text } from '@x-vision/design/index.js'
import { useUpdate } from 'ahooks'

function AddVault() {
  const [state] = useState({
    isChooseAddMedia: false,
    isChooseAddPrice: false,
    media: [],
    price: 0,
  })
  const update = useUpdate()

  const updatePrice = (price: number) => {
    state.price = price
    update()
  }
  const updateIsChooseAddPrice = (v: boolean) => {
    state.isChooseAddPrice = v
    update()
  }

  return (
    <div className="flex flex-col gap-2">
      {/* checkbox */}
      <div
        className="flex items-center space-x-2"
        onClick={() => {
          state.isChooseAddMedia = !state.isChooseAddMedia
          update()
        }}
      >
        <Checkbox checked={state.isChooseAddMedia}></Checkbox>
        <Text>Add media</Text>
      </div>
      {state.isChooseAddMedia && (
        <div className="flex flex-col gap-1 ml-2">
          {/* media */}
          <Avatar shape="square" />
          {/* upload */}
          <Button className="w-fit">Upload</Button>
        </div>
      )}
      {/* price */}
      {state.isChooseAddMedia && (
        <div className="ml-2">
          <AddPrice
            updatePrice={updatePrice}
            price={state.price}
            updateIsChooseAddPrice={updateIsChooseAddPrice}
            isChooseAddPrice={state.isChooseAddPrice}
          />
        </div>
      )}
    </div>
  )
}

export default AddVault
