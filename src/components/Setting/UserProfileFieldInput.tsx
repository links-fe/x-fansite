import { cln, Input, Textarea } from '@x-vision/design'
import { error } from 'console'
import { ErrorAlert } from './ErrorAlert'
import { ChangeEventHandler } from 'react'

/**
 * 用户资料表单项输入组件
 * @param type - 输入框类型：文本输入框(input) 或 多行文本框(textarea)
 * @param value - 受控输入值
 * @param error - 错误提示信息
 * @param alert - 辅助提示信息（优先级低于error）
 * @param onChange - 输入变更处理器
 */
export function ProfileFieldInput({
  type = 'input',
  value,
  error,
  alert,
  onChange,
  className,
  ...props
}: { type: 'input' | 'textarea'; value: string; error: string; alert?: string } & React.ComponentProps<
  typeof Input | typeof Textarea
>) {
  return (
    <div className={cln('flex flex-col gap-(--sizing-unit)', className)}>
      {type === 'textarea' && (
        <Textarea
          placeholder=""
          value={value}
          variant={error ? 'stop' : 'default'}
          rows={3}
          maxLength={300}
          showCount="default"
          className=" py-(--control-small-padding-vertical) px-(--control-small-padding-horizontal)"
          onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
          {...(props as React.ComponentProps<typeof Textarea>)}
        />
      )}
      {type === 'input' && (
        <Input
          type="text"
          value={value}
          variant={error ? 'stop' : 'default'}
          className=" py-(--control-huge-padding-vertical) px-(--control-huge-padding-horizontal)"
          onChange={onChange as ChangeEventHandler<HTMLInputElement>}
          {...(props as React.ComponentProps<typeof Input>)}
        />
      )}
      <ErrorAlert error={error} message={alert} />
    </div>
  )
}
