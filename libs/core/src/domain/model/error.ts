import * as Schema from 'effect/Schema'

const TypeId: unique symbol = Symbol('@agenticz/AIError')
export class AIError extends Schema.TaggedError<AIError>('@agenticz/AIError')(
  'AIError',
  {
    module: Schema.String,
    method: Schema.String,
    description: Schema.String,
    cause: Schema.optional(Schema.Defect),
  },
) {
  readonly [TypeId]: typeof TypeId = TypeId
  get message(): string {
    return `${this.module}.${this.method}: ${this.description}`
  }
}
