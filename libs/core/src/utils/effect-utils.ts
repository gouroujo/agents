/**
 * Core Effect.js utilities
 */
import {
  Effect,
  Context,
  Scope,
  Config,
  Layer,
  pipe,
  Option,
  Data,
  Schedule,
  Duration
} from 'effect'

/**
 * Re-export commonly used Effect.js modules
 */
export {
  Effect,
  Context,
  Scope,
  Config,
  Layer,
  pipe,
  Option,
  Data,
  Schedule,
  Duration
}

/**
 * Common type for Effect results
 */
export type EffectResult<A> = Effect.Effect<A>

/**
 * Common type for Effect that might fail
 */
export type EffectFallible<A, E = Error> = Effect.Effect<A, E>

/**
 * Common type for Effect with context
 */
export type EffectWithContext<A, R, E = Error> = Effect.Effect<A, E, R>

/**
 * Create a basic retry policy with exponential backoff
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 */
export const createRetryPolicy = (
  maxRetries = 3,
  initialDelay = 500
) =>
  pipe(
    Schedule.exponential(Duration.millis(initialDelay)),
    Schedule.compose(Schedule.recurs(maxRetries))
  )

/**
 * Helper to run an Effect and return the result or throw an error
 * @param effect The effect to run
 */
export const runEffectSync = <A>(effect: EffectResult<A>): A => {
  return Effect.runSync(effect)
}

/**
 * Helper to run an Effect asynchronously and handle the result
 * @param effect The effect to run
 */
export const runEffectPromise = <A, E = Error>(
  effect: EffectFallible<A, E>
): Promise<A> => {
  return Effect.runPromise(effect)
}

/**
 * Safely catch errors in Effects and transform them
 * @param effect The effect to run
 * @param handler Error handler function
 */
export const catchEffect = <A, E, R, E2>(
  effect: Effect.Effect<A, E, R>,
  handler: (error: E) => Effect.Effect<A, E2, R>
): Effect.Effect<A, E2, R> => {
  return Effect.catchAll(effect, handler)
}

/**
 * Run multiple effects in parallel
 * @param effects Array of effects to run in parallel
 */
export const runParallel = <A, E, R>(
  effects: ReadonlyArray<Effect.Effect<A, E, R>>
): Effect.Effect<ReadonlyArray<A>, E, R> => {
  return Effect.all(effects, { concurrency: 'unbounded' })
}

/**
 * Run multiple effects in sequence
 * @param effects Array of effects to run in sequence
 */
export const runSequential = <A, E, R>(
  effects: ReadonlyArray<Effect.Effect<A, E, R>>
): Effect.Effect<ReadonlyArray<A>, E, R> => {
  return Effect.all(effects, { concurrency: 1 })
}