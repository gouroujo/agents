import { Chunk, Effect, pipe, Schema, Stream } from 'effect'
import { idSchema } from '../utils'
import { Model } from '../model'
import { Task } from '../task/task'
import { Thread, UserMessage } from '../thread'

// export const Agent = Schema.Struct({
//   id: idSchema,
//   backstory: Schema.String,
// })
// export type Agent = typeof Agent.Type

/**
 * Create a retry schedule for task execution
 */
// const createRetrySchedule = () =>
//   Schedule.exponential(Duration.millis(500), 2).pipe(
//     Schedule.upTo(3),
//     Schedule.whileInput(
//       (error: TaskError | LLMError) =>
//         error instanceof LLMNetworkError || error instanceof LLMError,
//     ),
//   )

export class Agent extends Schema.Class<Agent>('Agent')({
  id: idSchema,
  backstory: Schema.NonEmptyString,
}) {
  execute(task: Task) {
    return pipe(
      Effect.gen(function* () {
        const model = yield* Model
        const thread = Thread.make({
          messages: [
            UserMessage.make({ content: task.description, role: 'user' }),
          ],
        })
        return Stream.runCollect(model.generate(thread))
      }),
      Effect.flatten,
      Effect.map((chunk) =>
        chunk.pipe(Chunk.reduce('', (b, response) => b + response.content)),
      ),
    )
  }
}
