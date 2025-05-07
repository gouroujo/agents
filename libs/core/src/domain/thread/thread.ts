import { Schema } from 'effect'
import { Message } from './message'
import { Identifier } from '../utils'

export class Thread extends Schema.Class<Thread>('Thread')({
  id: Identifier('Thread'),
  messages: Schema.optionalWith(Schema.Array(Message), {
    default: () => [],
    exact: true,
  }),
}) {}
