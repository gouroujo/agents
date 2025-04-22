import { Effect, Context, Layer, Console } from 'effect'

/**
 * Span interface for tracing
 */
export interface Span {
  /** Set an attribute on the span */
  setAttribute(key: string, value: string | number | boolean): void
  /** Record an exception in the span */
  recordException(error: Error): void
  /** End the span */
  end(): void
}

/**
 * Observability service for logging, metrics and tracing
 */
export interface Observability {
  /** Start a new span for tracing */
  startSpan(options: {
    name: string
    attributes?: Record<string, string | number | boolean>
  }): Span
  /** Log an info message */
  info(
    message: string,
    metadata?: Record<string, unknown>,
  ): Effect.Effect<void, never, never>
  /** Log a warning message */
  warn(
    message: string,
    metadata?: Record<string, unknown>,
  ): Effect.Effect<void, never, never>
  /** Log an error message */
  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
  ): Effect.Effect<void, never, never>
}

/**
 * Creates a span for tracing
 */
export const createSpan = (options: {
  name: string
  attributes?: Record<string, string | number | boolean>
}): Span => {
  const startTime = Date.now()
  const attributes = options.attributes || {}

  // Log span start
  Effect.runSync(
    Console.log(`[SPAN START] ${options.name} ${JSON.stringify(attributes)}`),
  )

  return {
    setAttribute(key: string, value: string | number | boolean) {
      attributes[key] = value
      // Not logging every attribute to reduce noise
    },
    recordException(error: Error) {
      Effect.runSync(
        Console.error(`[SPAN ERROR] ${options.name} ${error.message}`, error),
      )
    },
    end() {
      const duration = Date.now() - startTime
      attributes['duration_ms'] = duration
      Effect.runSync(
        Console.log(`[SPAN END] ${options.name} ${JSON.stringify(attributes)}`),
      )
    },
  }
}

/**
 * Creates an info log message
 */
export const createInfoLog = (
  message: string,
  metadata?: Record<string, unknown>,
): Effect.Effect<void, never, never> => {
  const logMessage = metadata
    ? `${message} ${JSON.stringify(metadata)}`
    : message
  return Console.log(`[INFO] ${logMessage}`)
}

/**
 * Creates a warning log message
 */
export const createWarnLog = (
  message: string,
  metadata?: Record<string, unknown>,
): Effect.Effect<void, never, never> => {
  const logMessage = metadata
    ? `${message} ${JSON.stringify(metadata)}`
    : message
  return Console.warn(`[WARN] ${logMessage}`)
}

/**
 * Creates an error log message
 */
export const createErrorLog = (
  message: string,
  error?: Error,
  metadata?: Record<string, unknown>,
): Effect.Effect<void, never, never> => {
  const logMessage = metadata
    ? `${message} ${JSON.stringify(metadata)}`
    : message
  return Console.error(`[ERROR] ${logMessage}`, error)
}

/**
 * Creates the observability service implementation
 */
export const makeObservability = (): Observability => ({
  startSpan: createSpan,
  info: createInfoLog,
  warn: createWarnLog,
  error: createErrorLog,
})

/**
 * Observability Context tag
 */
export const ObservabilityContext =
  Context.GenericTag<Observability>('Observability')

/**
 * Layer providing the default observability implementation
 */
export const ObservabilityLive = Layer.succeed(
  ObservabilityContext,
  makeObservability(),
)

/**
 * Static utility methods for observability
 */
export const Observability = {
  /** Get the observability service */
  get: ObservabilityContext,

  /** Start a new span for tracing */
  startSpan: createSpan,

  /** Create a Layer with the default observability implementation */
  layer: ObservabilityLive,
}
