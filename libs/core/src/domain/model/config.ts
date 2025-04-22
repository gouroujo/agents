/**
 * Model parameters for generation
 */
export interface ModelParameters {
  readonly model?: string
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
