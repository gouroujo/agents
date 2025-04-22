import { Data } from 'effect'

/**
 * Base error for all agenticz errors
 */
export class AgenticzError extends Data.TaggedError('AgenticzError')<{
  message: string
}> {}
