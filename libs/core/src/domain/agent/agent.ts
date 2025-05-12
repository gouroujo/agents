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
})

export const make = (model: Context.Context<Completions.CompletionModel>) => {
  return {
    exececute(task: string) {
      return Effect.provide(
        Effect.gen(function* () {
          const model = yield* Completions.CompletionModel
          return yield* model.generate(task)
        }),
        model,
      )
    },
  }
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
