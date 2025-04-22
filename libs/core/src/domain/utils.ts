import { randomUUID } from 'crypto'
import { Schema } from 'effect'

export const idSchema = Schema.String.pipe(
  Schema.propertySignature,
  Schema.withConstructorDefault(() => randomUUID()),
)
