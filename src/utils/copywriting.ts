import { MessageFormat } from 'messageformat'
import { DraftFunctions } from 'messageformat/functions'
// const msg = 'Hello {$user.name}, today is {$date :date style=long}';
// const mf = new MessageFormat('en', msg, { functions: DraftFunctions });

export interface ICopywritingParams {
  name: string
  type: 'string' | 'date' | 'number' | 'object'
  /** 示例 */
  examples: unknown[]
}

export interface ICopywritingConfig {
  content: string
  params?: ICopywritingParams[]
  render?: (params: Record<string, unknown>) => string
  /** 语言 */
  language?: 'en'
}
export function renderCopywriting(config: ICopywritingConfig, params: Record<string, unknown> = {}) {
  if (config.render) {
    return config.render(params)
  }

  const mf = new MessageFormat(config.language || 'en', config.content, { functions: DraftFunctions })
  return mf.format(params)
}

/**
 * 生成文案示例  (次函数代码为AI生成没有细看)
 * @param config
 * @returns
 */
export function renderCopywritingExamples(config: ICopywritingConfig) {
  if (!config.params) return []

  const paramNames = config.params.map((param) => param.name)
  const examplesList: unknown[][] = config.params.map((param) => param.examples)

  function cartesian(arrays: unknown[][]): unknown[][] {
    return arrays.reduce<unknown[][]>(
      (a, b) => a.flatMap((d) => (Array.isArray(b) ? b.map((e) => [...(d as unknown[]), e]) : [])),
      [[]],
    )
  }

  const allCombinations: unknown[][] = cartesian(examplesList)
  // 组装成对象数组
  const paramsList = allCombinations.map((comb) => Object.fromEntries(paramNames.map((name, i) => [name, comb[i]])))

  return paramsList.map((v) => renderCopywriting(config, v))
}
