import {
  Chunk,
  Context,
  Effect,
  Layer,
  pipe,
  Schema,
  Stream,
  flow,
} from 'effect'
import { Identifier } from '../utils'
import { Completions } from '../model'

const AgentSchema = Schema.Struct({
  id: Identifier('Agent'),
  backstory: Schema.NonEmptyString,
  model: Schema.declare(
    (input: unknown): input is Completions.Completions['Type'] =>
      input instanceof Completions.Completions,
  ),
})

export class Agent extends Context.Tag('@agenticz/Agent')<
  Agent,
  {
    readonly execute: (task: string) => Effect.Effect<string>
  }
>() {
  static make = flow(AgentSchema.make, (props) => ({
    execute: (task: string) =>
      Effect.gen(function* () {
        return yield* props.model.generate('aa')
      }),
  }))
}

// export class Agent extends Schema.TaggedClass<Agent>()('Agent', {
//   id: IdentifierSchema,
//   backstory: Schema.NonEmptyString,
//   model: Schema.,
// }) {
// execute(task: Task) {
//   const model = this.model
//   const thread = Thread.make({
//     messages: [UserMessage.make({ content: task.description, role: 'user' })],
//   })
//   return pipe(
//     Stream.runCollect(model.generate(thread)),
//     Effect.map((chunk) =>
//       chunk.pipe(Chunk.reduce('', (b, response) => b + response.content)),
//     ),
//   )
// }
// }
