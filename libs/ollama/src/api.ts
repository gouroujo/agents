import * as HttpClient from '@effect/platform/HttpClient'
import * as HttpClientError from '@effect/platform/HttpClientError'
import * as HttpClientRequest from '@effect/platform/HttpClientRequest'
import * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import { pipe } from 'effect'
import * as Effect from 'effect/Effect'
import * as S from 'effect/Schema'
import { OllamaGenerateErrorResponse, OllamaGenerateResponse } from './dto'
import * as Console from 'effect/Console'

export const make = (
  httpClient: HttpClient.HttpClient,
  options: {
    readonly baseUrl?: string
  },
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
        HttpClientRequest.make('POST')('/api/chat'),
        HttpClientRequest.prependUrl(
          options.baseUrl ?? 'http://localhost:11434',
        ),
        HttpClientRequest.bodyJson({
          model: 'llama3.2',
          messages: [
            {
              role: 'user',
              content: 'why is the sky blue?',
            },
          ],
          stream: false,
        }),
        Effect.flatMap((request) => httpClient.execute(request)),
        Effect.flatMap(
          HttpClientResponse.matchStatus({
            '2xx': (r) => {
              return HttpClientResponse.schemaBodyJson(OllamaGenerateResponse)(
                r,
              )
            },
            '4xx': decodeError(OllamaGenerateErrorResponse),
            orElse: unexpectedStatus,
          }),
        ),
      ),
  }
}
