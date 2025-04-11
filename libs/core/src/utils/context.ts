/**
 * Context services and dependency injection utilities
 */
import { Context, Effect, Layer } from 'effect'

/**
 * Configuration context for the application
 */
export interface AppConfig {
  readonly environment: 'development' | 'production' | 'test'
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error'
}

/**
 * Context tag for AppConfig
 */
export class AppConfigTag extends Context.Tag('AppConfigTag')<AppConfigTag, AppConfig>() {}

/**
 * Default configuration values
 */
export const defaultConfig: AppConfig = {
  environment: 'development',
  logLevel: 'info'
}

/**
 * Layer for providing the AppConfig
 */
export const AppConfigLive = Layer.succeed(
  AppConfigTag,
  defaultConfig
)

/**
 * Interface for runtime environment
 */
export interface RuntimeEnv {
  readonly config: AppConfig
}

/**
 * Context tag for RuntimeEnv
 */
export class RuntimeEnvTag extends Context.Tag('RuntimeEnvTag')<RuntimeEnvTag, RuntimeEnv>() {}

/**
 * Layer for providing the RuntimeEnv
 */
export const RuntimeEnvLive = Layer.effect(
  RuntimeEnvTag,
  Effect.map(
    AppConfigTag,
    (config): RuntimeEnv => ({ config })
  )
)

/**
 * Create a custom context
 * @param name A unique name for the tag
 */
export const createContext = <T>(name: string) => {
  class CustomTag extends Context.Tag(name)<CustomTag, unknown>() {}
  return CustomTag as unknown as Context.Tag<unknown, T>
}

/**
 * Create a test layer with mock implementations
 * @param tag The context tag to provide
 * @param implementation Mock implementation
 */
export function createMockLayer<T, Tag extends Context.Tag<any, T>>(tag: Tag, implementation: T): Layer.Layer<never, never, Tag> {
  return Layer.succeed(tag, implementation)
}