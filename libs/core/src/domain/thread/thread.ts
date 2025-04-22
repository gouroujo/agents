import { Schema } from 'effect'
import { Message } from './message'
import { idSchema } from '../utils'

export class Thread extends Schema.Class<Thread>('Thread')({
  id: idSchema,
  messages: Schema.optionalWith(Schema.Array(Message), {
    default: () => [],
    exact: true,
  }),
}) {}
