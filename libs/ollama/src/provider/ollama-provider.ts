import {
  Thread,
  ModelError,
  ModelParameters,
  CompletionResponse,
  Model,
} from '@agenticz/core'
import { Console, Effect, Layer, pipe, Stream } from 'effect'
import { Ollama, Message } from 'ollama'

/**
 * Ollama provider configuration
 */
export interface OllamaProviderConfig {
  defaultModel: string
  /** Base URL for Ollama API (default: http://localhost:11434) */
  baseUrl?: string
}

/**
 * Convert an error to an ModelError
 */
const toProviderError = (error: unknown): ModelError => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  // Create a new ModelError instance
  return new ModelError({
    message: `Ollama API error: ${errorMessage}`,
    cause: error,
  })
}

const convertThreadToOllamaMessages = (thread: Thread): Message[] =>
  thread.messages.map((message) => ({
    role: message.role,
    content: message.content,
  }))

export const OllamaProvider = Layer.succeed(
  Model,
  Model.of({
    generate: (
      thread: Thread,
      params?: ModelParameters,
    ): Stream.Stream<CompletionResponse, ModelError, never> => {
      const client = new Ollama({
        host: 'http://localhost:11434',
      })
      return pipe(
        Effect.tryPromise({
          try: () =>
            client.chat({
              model: params?.model ?? 'llama3.2',
              stream: true,
              messages: convertThreadToOllamaMessages(thread),
              options: {
                temperature: params?.temperature,
                top_p: params?.topP,
              },
            }),
          catch: toProviderError,
        }),
        Stream.fromEffect,
        Stream.flatMap((iterable) =>
          Stream.fromAsyncIterable(iterable, toProviderError),
        ),
        // Stream.tap((response) => Console.log(`response: ${response.message}`)),
        Stream.map(
          (response): CompletionResponse => ({
            content: response.message.content,
            metadata: {
              promptTokens: response.prompt_eval_count,
              completionTokens: response.eval_count,
              totalTokens: undefined,
              model: response.model,
            },
          }),
        ),
      )
    },
  }),
)

// Define a Cache service
// export class OllamaProvider extends Effect.Service<Model>()('provider/Ollama', {
//   // Define how to create the service
//   sync: () => {
//     const client = new Ollama({
//       host: 'http://localhost:11434',
//     })
//     return {
//       generate: (
//         thread: Thread,
//         params?: ModelParameters,
//       ): Stream.Stream<CompletionResponse, ModelError, never> =>
//         pipe(
//           Effect.tryPromise({
//             try: () =>
//               client.chat({
//                 model: params?.model ?? 'llama3.2',
//                 stream: true,
//                 messages: convertThreadToOllamaMessages(thread),
//                 options: {
//                   temperature: params?.temperature,
//                   top_p: params?.topP,
//                 },
//               }),
//             catch: toProviderError,
//           }),
//           Stream.fromEffect,
//           Stream.flatMap((iterable) =>
//             Stream.fromAsyncIterable(iterable, toProviderError),
//           ),
//           Stream.tap((response) =>
//             Console.log(`response: ${response.message}`),
//           ),
//           Stream.map(
//             (response): CompletionResponse => ({
//               content: response.message.content,
//               metadata: {
//                 promptTokens: response.prompt_eval_count,
//                 completionTokens: response.eval_count,
//                 totalTokens: undefined,
//                 model: response.model,
//               },
//             }),
//           ),
//         ),
//     }
//   },
// }) {}

// export const createOllamaProvider = (
//   config: OllamaProviderConfig,
// ): ModelInterface => {
//   const client = new Ollama({
//     host: config?.baseUrl || 'http://localhost:11434',
//   })

//   return {
//     generate: (
//       thread: Thread,
//       params?: ModelParameters,
//     ): Stream.Stream<CompletionResponse, ModelError, never> =>
//       pipe(
//         Effect.tryPromise({
//           try: () =>
//             client.chat({
//               model: params?.model ?? config.defaultModel,
//               stream: true,
//               messages: convertThreadToOllamaMessages(thread),
//               options: {
//                 temperature: params?.temperature,
//                 top_p: params?.topP,
//               },
//             }),
//           catch: toProviderError,
//         }),
//         Stream.fromEffect,
//         Stream.flatMap((iterable) =>
//           Stream.fromAsyncIterable(iterable, toProviderError),
//         ),
//         Stream.tap((response) => Console.log(`response: ${response.message}`)),
//         Stream.map(
//           (response): CompletionResponse => ({
//             content: response.message.content,
//             metadata: {
//               promptTokens: response.prompt_eval_count,
//               completionTokens: response.eval_count,
//               totalTokens: undefined,
//               model: response.model,
//             },
//           }),
//         ),
//       ),
//   }
// }
