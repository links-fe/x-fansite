import { Icon } from '@x-vision/icons'

/**
 * 错误提示组件（支持普通消息和错误状态）
 * @param error - 错误信息（存在时显示错误状态）
 * @param message - 普通提示信息（仅在无error时显示）
 */
export function ErrorAlert({ error, message }: { error: string; message?: string }) {
  return (
    <div className="typography-numbers-body2-base text-(--light-brand-primary-01)">
      {error ? (
        <div className="flex gap-(--named-micro) text-(--light-spectrum-saffron-00)">
          <Icon className="shrink-0" icon="x:InformationCircleStyleStroke" fontSize={16} />
          {error}
        </div>
      ) : (
        <span>{message}</span>
      )}
    </div>
  )
}
