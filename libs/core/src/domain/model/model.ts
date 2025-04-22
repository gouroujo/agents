import { Context, Stream } from 'effect'
import { CompletionConfig, CompletionResponse } from './completion'
import { Thread } from '../thread'
import { ModelError } from './errors'

export interface ModelInterface {
  /** Generate a response from the language model */
  generate(
    thread: Thread,
    config?: CompletionConfig,
  ): Stream.Stream<CompletionResponse, ModelError, never>
}

export class Model extends Context.Tag('ModelService')<
  Model,
  ModelInterface
>() {}
