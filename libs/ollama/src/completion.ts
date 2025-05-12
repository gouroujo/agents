import { AIError, AIModel, Completions } from '@agenticz/core'
import { Context, Effect, Layer } from 'effect'
import { OllamaClient } from './client'
import { OllamaGenerateResponse } from './dto'
import * as Console from 'effect/Console'

const modelCacheKey = Symbol.for('@agenticz/Ollama/CacheKey')

export const model = (model: string, config?: Omit<any, 'model'>) =>
  make({ model, config })

export const make = Effect.fnUntraced(function* (options: {
  readonly model: string
  readonly config?: Omit<any, 'model'>
}) {
  const client = yield* OllamaClient

  const makeRequest = ({
    input,
    required,
    system,
  }: Completions.CompletionOptions) => {
    // const useStructured = tools.length === 1 && tools[0].structured
    return Effect.succeed(42)
  }

  return Completions.make({
    generate({ span, ...options }) {
      return makeRequest(options).pipe(
        // Effect.tap((request) => annotateRequest(span, request)),
        Effect.flatMap(client.chat),
        // Effect.tap((response) => annotateChatResponse(span, response)),
        Effect.map((response) => response.message.content),
        Effect.catchAll((cause) =>
          Effect.fail(
            new AIError({
              module: 'OpenAiCompletions',
              method: 'create',
              description: 'An error occurred: ' + cause,
              cause,
            }),
          ),
        ),
      )
    },
    // stream({ span, ...options }) {
    //   return makeRequest(options).pipe(
    //     Effect.tap((request) => annotateRequest(span, request)),
    //     Effect.map(client.stream),
    //     Stream.unwrap,
    //     Stream.tap((response) => {
    //       annotateStreamResponse(span, response)
    //       return Effect.void
    //     }),
    //     Stream.map((response) => response.asAiResponse),
    //     Stream.catchAll((cause) =>
    //       Effect.fail(
    //         new AiError({
    //           module: 'OpenAiCompletions',
    //           method: 'stream',
    //           description: 'An error occurred',
    //           cause,
    //         }),
    //       ),
    //     ),
    //   )
    // },
  })
})
