import { Context, Effect } from 'effect'
import * as Chunk from 'effect/Chunk'
import * as Option from 'effect/Option'
import { Span } from 'effect/Tracer'
import { AIError } from './error'
import * as JsonSchema from 'effect/JSONSchema'
import { Message } from '../thread/message'

export class Completions extends Context.Tag('@agenticz/Completions')<
  Completions,
  {
    readonly generate: (input: any) => Effect.Effect<any, AIError>
  }
>() {}

export interface CompletionOptions {
  readonly system: Option.Option<string>
  readonly input: Chunk.Chunk<Message>
  // readonly tools: Array<{
  //   readonly name: string
  //   readonly description: string
  //   readonly parameters: JsonSchema.JsonSchema7
  //   readonly structured: boolean
  // }>
  readonly required: boolean | string
}
export interface CompletionOptionsWithSpan extends CompletionOptions {
  readonly span: Span
}

export const make = (options: {
  readonly generate: (
    options: CompletionOptionsWithSpan,
  ) => Effect.Effect<any, AIError>
}): Effect.Effect<typeof Completions.Service> => {
  return Effect.succeed(
    Completions.of({
      generate: (input) =>
        Effect.useSpan(
          'Completions.create',
          { captureStackTrace: false },
          (span) =>
            options.generate({
              system: Option.none(), // could use Effect.serviceOption(AiInput.SystemInstruction)
              input: Chunk.empty(),
              // tools: [],
              required: false,
              span,
            }),
        ),
    }),
  )
}
