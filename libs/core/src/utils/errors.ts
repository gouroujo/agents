/**
 * Error handling utilities and error types
 */
import { Data } from 'effect'

/**
 * Base error class for all AgenticzJS errors
 */
export class AgenticzError extends Data.TaggedError('AgenticzError')<{
  readonly message: string
  readonly cause?: Error
}> {
  /**
   * Create a new AgenticzError
   * @param message Error message
   * @param cause Optional underlying error cause
   */
  constructor(message: string, cause?: Error) {
    super({ message, cause })
  }
}

/**
 * Configuration error type
 */
export class ConfigurationError extends Data.TaggedError('ConfigurationError')<{
  readonly message: string
  readonly key?: string
  readonly context?: string
  readonly cause?: Error
}> {
  /**
   * Create a new ConfigurationError
   * @param message Error message
   * @param key Optional configuration key
   * @param context Optional configuration context
   * @param cause Optional underlying error cause
   */
  constructor(
    message: string,
    key?: string,
    context?: string,
    cause?: Error
  ) {
    super({ message, key, context, cause })
  }
}

/**
 * Integration error type for external services
 */
export class IntegrationError extends Data.TaggedError('IntegrationError')<{
  readonly message: string
  readonly service: string
  readonly operation: string
  readonly cause?: Error
}> {
  /**
   * Create a new IntegrationError
   * @param message Error message
   * @param service External service name
   * @param operation Operation that failed
   * @param cause Optional underlying error cause
   */
  constructor(
    message: string,
    service: string,
    operation: string,
    cause?: Error
  ) {
    super({ message, service, operation, cause })
  }
}

/**
 * Task error type for agent tasks
 */
export class TaskError extends Data.TaggedError('TaskError')<{
  readonly message: string
  readonly taskId: string
  readonly agentId?: string
  readonly cause?: Error
}> {
  /**
   * Create a new TaskError
   * @param message Error message
   * @param taskId ID of the task that failed
   * @param agentId Optional ID of the agent executing the task
   * @param cause Optional underlying error cause
   */
  constructor(
    message: string,
    taskId: string,
    agentId?: string,
    cause?: Error
  ) {
    super({ message, taskId, agentId, cause })
  }
}

/**
 * Agent error type for agent-specific errors
 */
export class AgentError extends Data.TaggedError('AgentError')<{
  readonly message: string
  readonly agentId: string
  readonly context?: string
  readonly cause?: Error
}> {
  /**
   * Create a new AgentError
   * @param message Error message
   * @param agentId ID of the agent
   * @param context Optional context of the error
   * @param cause Optional underlying error cause
   */
  constructor(
    message: string,
    agentId: string,
    context?: string,
    cause?: Error
  ) {
    super({ message, agentId, context, cause })
  }
}

/**
 * Team error type for team-specific errors
 */
export class TeamError extends Data.TaggedError('TeamError')<{
  readonly message: string
  readonly teamId: string
  readonly context?: string
  readonly cause?: Error
}> {
  /**
   * Create a new TeamError
   * @param message Error message
   * @param teamId ID of the team
   * @param context Optional context of the error
   * @param cause Optional underlying error cause
   */
  constructor(
    message: string,
    teamId: string,
    context?: string,
    cause?: Error
  ) {
    super({ message, teamId, context, cause })
  }
}

/**
 * Tool error type for tool execution errors
 */
export class ToolError extends Data.TaggedError('ToolError')<{
  readonly message: string
  readonly toolId: string
  readonly parameters?: Record<string, unknown>
  readonly cause?: Error
}> {
  /**
   * Create a new ToolError
   * @param message Error message
   * @param toolId ID of the tool
   * @param parameters Optional parameters that caused the error
   * @param cause Optional underlying error cause
   */
  constructor(
    message: string,
    toolId: string,
    parameters?: Record<string, unknown>,
    cause?: Error
  ) {
    super({ message, toolId, parameters, cause })
  }
}

/**
 * LLM provider error type for LLM-specific errors
 */
export class LLMProviderError extends Data.TaggedError('LLMProviderError')<{
  readonly message: string
  readonly provider: string
  readonly operation: string
  readonly cause?: Error
}> {
  /**
   * Create a new LLMProviderError
   * @param message Error message
   * @param provider Provider name
   * @param operation Operation that failed
   * @param cause Optional underlying error cause
   */
  constructor(
    message: string,
    provider: string,
    operation: string,
    cause?: Error
  ) {
    super({ message, provider, operation, cause })
  }
}

/**
 * Error matcher to handle different error types
 * @param error The error to match against
 * @param handlers Object with handler functions for each error type
 */
export const matchError = <T>(
  error: unknown,
  handlers: {
    ConfigurationError?: (error: ConfigurationError) => T
    IntegrationError?: (error: IntegrationError) => T
    TaskError?: (error: TaskError) => T
    AgentError?: (error: AgentError) => T
    TeamError?: (error: TeamError) => T
    ToolError?: (error: ToolError) => T
    LLMProviderError?: (error: LLMProviderError) => T
    AgenticzError?: (error: AgenticzError) => T
    _?: (error: unknown) => T
  }
): T => {
  if (error instanceof ConfigurationError && handlers.ConfigurationError) {
    return handlers.ConfigurationError(error)
  }
  if (error instanceof IntegrationError && handlers.IntegrationError) {
    return handlers.IntegrationError(error)
  }
  if (error instanceof TaskError && handlers.TaskError) {
    return handlers.TaskError(error)
  }
  if (error instanceof AgentError && handlers.AgentError) {
    return handlers.AgentError(error)
  }
  if (error instanceof TeamError && handlers.TeamError) {
    return handlers.TeamError(error)
  }
  if (error instanceof ToolError && handlers.ToolError) {
    return handlers.ToolError(error)
  }
  if (error instanceof LLMProviderError && handlers.LLMProviderError) {
    return handlers.LLMProviderError(error)
  }
  if (error instanceof AgenticzError && handlers.AgenticzError) {
    return handlers.AgenticzError(error)
  }
  if (handlers._) {
    return handlers._(error)
  }
  throw error
}