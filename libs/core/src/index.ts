/**
 * @agenticz/core
 * Core functionality for the AgenticzJS library
 */

// Export utility modules
export * from './utils/effect-utils'
export * from './utils/context'
export * from './utils/errors'
export * from './utils/observability'

// Example usage demonstrating the core functionality
import { Effect, pipe, Layer } from 'effect'
import { 
  AppConfigTag, 
  RuntimeEnvTag, 
  RuntimeEnvLive,
  AppConfigLive 
} from './utils/context'
import {
  log,
  traced,
  metrics,
  AgenticzLoggerTag,
  AgenticzTracerTag,
  ObservabilityLive
} from './utils/observability'

// This module is just a library, the demo program is for testing only
// The library can be used normally by importing individual modules
console.log('AgenticzJS Core loaded successfully')

// Only execute when this file is run directly
if (require.main === module) {
  console.log('Running AgenticzJS core demo...')
  
  // Simple program that demonstrates the core functionality
  Effect.runSync(
    Effect.gen(function* (_) {
      const logger = yield* _(AgenticzLoggerTag)
      yield* _(logger.info('Starting AgenticzJS core'))
      console.log('Demo completed successfully')
    }).pipe(
      Effect.provide(ObservabilityLive),
      Effect.provide(AppConfigLive),
    )
  )
}