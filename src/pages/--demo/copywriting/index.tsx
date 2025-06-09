import { getCwConfig, XCwKeyType } from '@/common/copywriting'
import { renderCopywritingExamples } from '@/utils/copywriting'

export default function Page() {
  function renderExamples(key: XCwKeyType, title: string) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div>{title}</div>
        {renderCopywritingExamples(getCwConfig(key)).map((text, index) => (
          <div key={index}>{text}</div>
        ))}
      </div>
    )
  }
  return (
    <div>
      {renderExamples('demo.params', '带参数的文案 demo.params')}
      {renderExamples('demo.params-object', '对象参数的文案 demo.params-object')}
      {renderExamples('demo.money', '金额参数的文案 demo.money')}
      {renderExamples('demo.plural', '复数参数的文案 demo.plural')}
      {renderExamples('demo.date', '日期参数的文案 demo.date')}
    </div>
  )
}
