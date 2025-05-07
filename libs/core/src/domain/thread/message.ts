import { Effect, pipe, Schema } from 'effect'
import { ParseError } from 'effect/Cron'
import { Identifier } from '../utils'

const commonAttributes = {
  id: Identifier('Message'),
}
export const SystemMessage = Schema.Struct({
  ...commonAttributes,
  role: Schema.Literal('system'),
  content: Schema.String,
})
export const UserMessage = Schema.Struct({
  ...commonAttributes,
  role: Schema.Literal('user'),
  content: Schema.String,
})
export const AssistantMessage = Schema.Struct({
  ...commonAttributes,
  role: Schema.Literal('assistant'),
  content: Schema.String,
})
export const ToolMessage = Schema.Struct({
  ...commonAttributes,
  role: Schema.Literal('tool'),
  content: Schema.String,
})

export const Message = Schema.Union(
  SystemMessage,
  UserMessage,
  AssistantMessage,
  ToolMessage,
)
export type Message = typeof Message.Type

type CreateMessage = {
  <M extends (typeof Message.members)[0]['Type']>(message: {
    content: string
    role: M['role']
  }): Effect.Effect<M, ParseError, never>
  <M extends (typeof Message.members)[1]['Type']>(message: {
    content: string
    role: M['role']
  }): Effect.Effect<M, ParseError, never>
  <M extends (typeof Message.members)[2]['Type']>(message: {
    content: string
    role: M['role']
  }): Effect.Effect<M, ParseError, never>
  <M extends (typeof Message.members)[3]['Type']>(message: {
    content: string
    role: M['role']
  }): Effect.Effect<M, ParseError, never>
}

export const createMessage: CreateMessage = (message: {
  content: string
  role: Message['role']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => pipe(message, Schema.decodeUnknown(Message)) as any
