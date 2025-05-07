import * as Schema from 'effect/Schema'

export class Message extends Schema.TaggedClass<Message>('@agenticz/message')(
  'Message',
  {},
) {}
