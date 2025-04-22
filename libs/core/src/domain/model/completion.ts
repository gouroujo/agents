/**
 * CompletionConfig
 */
export interface CompletionConfig {
  /** Controls randomness (0-1) */
  readonly temperature?: number
  /** Top-p sampling parameter (0-1) */
  readonly topP?: number
  /** Max tokens to generate */
  readonly maxTokens?: number
  /** Token presence penalty */
  readonly presencePenalty?: number
  /** Token frequency penalty */
  readonly frequencyPenalty?: number
  /** Stop sequences */
  readonly stop?: ReadonlyArray<string>
}

/**
 * Response from a language model completion request
 */
export interface CompletionResponse {
  /** The generated text */
  readonly content: string
  /** Metadata about the response */
  readonly metadata: {
    /** The number of tokens in the prompt */
    readonly promptTokens?: number
    /** The number of tokens in the completion */
    readonly completionTokens?: number
    /** The number of total tokens used */
    readonly totalTokens?: number
    /** The model used */
    readonly model: string
  }
}
