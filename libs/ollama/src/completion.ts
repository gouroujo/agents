import { AIError, AIModel, Completions } from '@agenticz/core'
import { Context, Effect } from 'effect'
import { OllamaClient } from './client'
import { OllamaGenerateResponse } from './dto'

const modelCacheKey = Symbol.for('@agenticz/Ollama/CacheKey')

export const model = (
  model: string,
  config?: Omit<any, 'model'>,
): AIModel.AIModel<Completions.Completions, OllamaClient> =>
  AIModel.make({
    model,
    cacheKey: modelCacheKey,
    requires: OllamaClient,
    provides: make({ model, config }).pipe(
      Effect.map((completions) =>
        Context.make(Completions.Completions, completions),
      ),
    ),
  })

const make = Effect.fnUntraced(function* (options: {
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

  return yield* Completions.make({
    generate({ span, ...options }) {
      return makeRequest(options).pipe(
        // Effect.tap((request) => annotateRequest(span, request)),
        Effect.flatMap(client.chat),
        // Effect.tap((response) => annotateChatResponse(span, response)),
        Effect.map((response) => response.response),
        Effect.catchAll((cause) =>
          Effect.fail(
            new AIError({
              module: 'OpenAiCompletions',
              method: 'create',
              description: 'An error occurred',
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
