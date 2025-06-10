import React from 'react'
import Header from './Header'
import { Avatar, Button, Input, Text } from '@x-vision/design/index.js'
import { useForm, Controller } from 'react-hook-form'
import AddVault from './Add/AddVault'
import AddPrice from './Add/AddPrice'

interface IProps {
  mode: 'create' | 'edit' | 'view'
}

function EditHooks(props: IProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      message: '',
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="px-(--sizing-named-mini)">
      <Header onSave={handleSubmit(onSubmit)} />
      {/* preview */}
      <div className="flex w-full h-[300px] bg-(--surface-level-02-emphasis-00) my-[16px] rounded-(--sizing-named-mini) p-[16px]">
        <div className="flex flex-col flex-1 justify-end gap-1">
          <Text>Like what you see?</Text>
          <Avatar shape="square" />
          <Button className="w-fit">Unlock Free</Button>
          <Button className="w-full mt-[24px]">Preview</Button>
        </div>
      </div>
      {/* edit */}
      <div className="flex flex-col gap-(--sizing-named-intermediate)">
        <div className="flex flex-col gap-1 relative">
          <Text size="body1">Chat hook name</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'This field is required' }}
            render={({ field }) => <Input {...field} />}
          />
          {errors.name && (
            <Text size="body1" className="absolute bottom-[-20px] left-0">
              {errors.name.message}
            </Text>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Text size="body1">Message</Text>
          <Controller control={control} name="message" render={({ field }) => <Input {...field} />} />
          {errors.message && <p>{errors.message.message}</p>}
        </div>
        <div>
          <AddVault />
        </div>
      </div>
    </div>
  )
}

export default EditHooks
