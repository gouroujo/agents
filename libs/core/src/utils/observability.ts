/**
 * Observability utilities (logging, metrics, tracing)
 */
import {
  Effect,
  Layer,
  LogLevel,
  Metric,
  Context,
  pipe
} from 'effect'
import { AppConfigTag } from './context'

/**
 * Custom logger interface
 */
export interface AgenticzLogger {
  log(message: string, level: LogLevel.LogLevel): Effect.Effect<void>
  debug(message: string): Effect.Effect<void>
  info(message: string): Effect.Effect<void>
  warn(message: string): Effect.Effect<void>
  error(message: string): Effect.Effect<void>
  withContext(context: Record<string, unknown>): AgenticzLogger
}

/**
 * Context tag for AgenticzLogger
 */
export class AgenticzLoggerTag extends Context.Tag('AgenticzLoggerTag')<AgenticzLoggerTag, AgenticzLogger>() {}

/**
 * Create a logger with context
 */
const createLogger = (context: Record<string, unknown> = {}): AgenticzLogger => {
  const logger: AgenticzLogger = {
    log: (message, level) => {
      const formattedMessage = JSON.stringify({ ...context, message })
      const timestamp = new Date().toISOString()
      const levelName = level === LogLevel.Debug ? 'DEBUG' :
                       level === LogLevel.Info ? 'INFO' :
                       level === LogLevel.Warning ? 'WARN' :
                       level === LogLevel.Error ? 'ERROR' : 'INFO'
      // eslint-disable-next-line no-console
      console.log(`${timestamp} [${levelName}] ${formattedMessage}`)
      return Effect.succeed(undefined)
    },
    debug: (message) => logger.log(message, LogLevel.Debug),
    info: (message) => logger.log(message, LogLevel.Info),
    warn: (message) => logger.log(message, LogLevel.Warning),
    error: (message) => logger.log(message, LogLevel.Error),
    withContext: (newContext) => createLogger({ ...context, ...newContext })
  }
  return logger
}

/**
 * Live layer for the logger
 */
export const AgenticzLoggerLive = Layer.succeed(
  AgenticzLoggerTag,
  createLogger()
)

/**
 * Metrics namespace
 */
export const metrics = {
  /**
   * Counter for agent task executions
   */
  taskExecutions: Metric.counter('agenticz_task_executions_total'),

  /**
   * Counter for agent task failures
   */
  taskFailures: Metric.counter('agenticz_task_failures_total'),

  /**
   * Counter for agent tool usages
   */
  toolUsages: Metric.counter('agenticz_tool_usages_total'),

  /**
   * Counter for LLM provider calls
   */
  llmCalls: Metric.counter('agenticz_llm_calls_total')
}

/**
 * Simple tracer interface
 */
export interface AgenticzTracer {
  span<A, E, R>(
    name: string,
    attributes: Record<string, string>,
    effect: Effect.Effect<A, E, R>
  ): Effect.Effect<A, E, R>
}

/**
 * Context tag for AgenticzTracer
 */
export class AgenticzTracerTag extends Context.Tag('AgenticzTracerTag')<AgenticzTracerTag, AgenticzTracer>() {}

/**
 * Live layer for the tracer
 */
export const AgenticzTracerLive = Layer.succeed(
  AgenticzTracerTag,
  {
    span: <A, E, R>(
      name: string,
      attributes: Record<string, string>,
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E, R> => {
      const start = Date.now()
      return pipe(
        effect,
        Effect.tap(() => {
          const duration = Date.now() - start
          // eslint-disable-next-line no-console
          console.debug(`TRACE [${name}] Duration: ${duration}ms, Attributes: ${JSON.stringify(attributes)}`)
          return Effect.succeed(undefined)
        })
      )
    }
  }
)

/**
 * Combined observability layer
 */
export const ObservabilityLive = Layer.merge(
  AgenticzLoggerLive,
  AgenticzTracerLive
)

/**
 * Helper to log a message
 * @param message Message to log
 * @param level Log level
 */
export const log = (message: string, level: 'debug' | 'info' | 'warn' | 'error' = 'info'): Effect.Effect<string, never, AgenticzLoggerTag> => {
  return Effect.gen(function* (_) {
    const logger = yield* _(AgenticzLoggerTag)
    
    switch (level) {
      case 'debug':
        yield* _(logger.debug(message))
        break
      case 'info':
        yield* _(logger.info(message))
        break
      case 'warn':
        yield* _(logger.warn(message))
        break
      case 'error':
        yield* _(logger.error(message))
        break
      default:
        yield* _(logger.info(message))
    }
    
    return message
  })
}

/**
 * Helper to create a traced section
 * @param name Name of the span
 * @param attributes Span attributes
 * @param effect The effect to trace
 */
export const traced = <A, E, R>(
  name: string,
  attributes: Record<string, string> = {},
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R | AgenticzTracerTag> => {
  return Effect.flatMap(
    AgenticzTracerTag,
    (tracer) => tracer.span(name, attributes, effect)
  )
}