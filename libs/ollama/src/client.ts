import { Config, Context, Layer } from 'effect'
import * as Effect from 'effect/Effect'
import * as HttpClient from '@effect/platform/HttpClient'
import * as OllamaAPI from './api'
import type { ConfigError } from 'effect/ConfigError'

export interface OllamaClientOptions {
  readonly apiUrl?: string | undefined
  readonly transformClient?: (
    client: HttpClient.HttpClient,
  ) => Effect.Effect<HttpClient.HttpClient>
}
export class OllamaClient extends Context.Tag('@agenticz/Ollama/Client')<
  OllamaClient,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {}

export const make = (options: OllamaClientOptions = {}) => {
  const applyClientTransform = options.transformClient
    ? options.transformClient
    : Effect.succeed<HttpClient.HttpClient>
  return Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient
    const httpClientTransformed = yield* applyClientTransform(httpClient)
    const api = OllamaAPI.make(httpClientTransformed, {})

    return api
  })
}

export const layerConfig = (
  options: OllamaClientOptions = {},
): Layer.Layer<OllamaClient, ConfigError, HttpClient.HttpClient> =>
  make(options).pipe(Layer.effect(OllamaClient))
