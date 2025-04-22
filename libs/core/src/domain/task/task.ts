import { Schema } from 'effect'
import { idSchema } from '../utils'

export const Task = Schema.Struct({
  id: idSchema,
  description: Schema.String,
  context: Schema.optional(Schema.String),
  // expectedOutput: Schema.optionalWith(Schema.Struct),
})
export type Task = typeof Task.Type

export const createTask = ({ description }: { description: string }) =>
  Schema.decodeUnknown(Task)({ description })

/**
 * Result of a task execution
 */
export interface TaskResult {
  /** The output content */
  readonly content: string
  /** Metadata about the execution */
  readonly metadata: {
    /** Time taken to execute the task in milliseconds */
    readonly executionTimeMs: number
    /** The number of tokens in the prompt */
    readonly promptTokens?: number
    /** The number of tokens in the completion */
    readonly completionTokens?: number
    /** The number of tokens in the total */
    readonly totalTokens?: number
  }
}
