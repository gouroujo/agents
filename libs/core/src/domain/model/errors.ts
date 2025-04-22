import { Data } from 'effect'

/**
 * Base LLM error class
 */
export class ModelError extends Data.TaggedError('ModelError')<{
  message: string
  cause?: unknown
}> {}
