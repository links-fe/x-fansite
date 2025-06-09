import { ICopywritingConfig } from '@/utils/copywriting'

export const cwDemo: Record<string, ICopywritingConfig> = {
  'demo.test': {
    content: 'test',
  },
  'demo.params': {
    content: 'app.params value:{$value} name:{$name}',
    params: [
      {
        name: 'value',
        type: 'number',
        examples: [1, 2],
      },
      {
        name: 'name',
        type: 'string',
        examples: ['Tom', 'Jerry'],
      },
    ],
  },
  'demo.params-object': {
    content: 'app.params value:{$obj.value} name:{$obj.name}',
    params: [
      {
        name: 'obj',
        type: 'object',
        examples: [
          { value: 1, name: 'Tom' },
          { value: 2, name: 'Jerry' },
        ],
      },
    ],
  },
  'demo.plural': {
    content: `
      .input {$count :number}
      .match $count
        0   {{没有新消息}}
        1   {{只有一条新消息}}
        *   {{{$count} 条新消息}}
    `,
    params: [
      {
        name: 'count',
        type: 'number',
        examples: [0, 1, 5],
      },
    ],
  },
  'demo.money': {
    content: 'Total: {$amount :number style=currency currency=USD}',
    params: [
      {
        name: 'amount',
        type: 'number',
        examples: [1234.56, 123456.78, 0.12],
      },
    ],
  },
  'demo.date': {
    content: 'Date: {$date :date style=long}',
    params: [
      {
        name: 'date',
        type: 'date',
        examples: [new Date(), new Date('2023-01-01'), new Date('2023-01-02')],
      },
    ],
  },
}
