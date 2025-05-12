import { Context, Effect } from 'effect'
import * as Chunk from 'effect/Chunk'
import * as Option from 'effect/Option'
import { Span } from 'effect/Tracer'
import { AIError } from './error'
import * as JsonSchema from 'effect/JSONSchema'
import { Message } from '../thread/message'

export class CompletionModel extends Context.Tag('@agenticz/CompletionModel')<
  CompletionModel,
  {
    readonly generate: (input: string) => Effect.Effect<string, AIError>
  }
>() {}

export interface CompletionOptions {
  readonly system: Option.Option<string>
  readonly input: Chunk.NonEmptyChunk<string>
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
  ) => Effect.Effect<string, AIError>
}): Context.Context<CompletionModel> => {
  return Context.make(CompletionModel, {
    generate: (input) =>
      Effect.useSpan(
        'Completions.create',
        { captureStackTrace: false },
        (span) =>
          options.generate({
            system: Option.none(), // could use Effect.serviceOption(AiInput.SystemInstruction)
            input: Chunk.of(input),
            // tools: [],
            required: false,
            span,
          }),
      ),
  })
}
