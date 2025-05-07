import * as HttpClient from '@effect/platform/HttpClient'
import * as HttpClientError from '@effect/platform/HttpClientError'
import * as HttpClientRequest from '@effect/platform/HttpClientRequest'
import * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import { pipe } from 'effect'
import * as Effect from 'effect/Effect'
import * as S from 'effect/Schema'
import { OllamaGenerateErrorResponse, OllamaGenerateResponse } from './dto'

export const make = (
  httpClient: HttpClient.HttpClient,
  options: {
    readonly transformClient?:
      | ((
          client: HttpClient.HttpClient,
        ) => Effect.Effect<HttpClient.HttpClient>)
      | undefined
  } = {},
) => {
  const unexpectedStatus = (response: HttpClientResponse.HttpClientResponse) =>
    Effect.flatMap(
      Effect.orElseSucceed(response.text, () => 'Unexpected status code'),
      (description) =>
        Effect.fail(
          new HttpClientError.ResponseError({
            request: response.request,
            response,
            reason: 'StatusCode',
            description,
          }),
        ),
    )

  const applyClientTransform = (
    client: HttpClient.HttpClient,
  ): Effect.Effect<HttpClient.HttpClient> =>
    options.transformClient
      ? options.transformClient(client)
      : Effect.succeed(client)

  const decodeError =
    <A, I, R>(schema: S.Schema<A, I, R>) =>
    (response: HttpClientResponse.HttpClientResponse) =>
      Effect.flatMap(
        HttpClientResponse.schemaBodyJson(schema)(response),
        Effect.fail,
      )

  return {
    chat: () =>
      pipe(
        Effect.gen(function* () {
          const client = yield* applyClientTransform(httpClient)
          console.log('called')
          const request = yield* HttpClientRequest.make('POST')(
            '/api/generate',
          ).pipe(
            HttpClientRequest.bodyJson({
              model: 'llama3.2',
              messages: [
                {
                  role: 'user',
                  content: 'why is the sky blue?',
                },
              ],
            }),
          )
          return yield* client.execute(request)
        }),
        Effect.flatMap(
          HttpClientResponse.matchStatus({
            '2xx': (r) =>
              HttpClientResponse.schemaBodyJson(OllamaGenerateResponse)(r),
            '4xx': decodeError(OllamaGenerateErrorResponse),
            orElse: unexpectedStatus,
          }),
        ),
      ),
  }
}
