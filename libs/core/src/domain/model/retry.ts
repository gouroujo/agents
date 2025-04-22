import { Schedule, Duration } from 'effect'

/**
 * Create a retry schedule for LLM API calls
 */
export const createLLMRetrySchedule = (config?: {
  /** Maximum number of retries
   * @default 3
   */
  maxRetries?: number
  /** Initial delay in milliseconds
   * @default 500ms
   */
  initialDelayMs?: number
}) =>
  Schedule.exponential(Duration.millis(config?.initialDelayMs ?? 500), 2).pipe(
    Schedule.upTo(config?.maxRetries ?? 3),
  )
