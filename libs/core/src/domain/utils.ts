import { randomUUID } from 'crypto'
import * as Schema from 'effect/Schema'
import * as Brand from 'effect/Brand'

export const Identifier = <T extends string>(of: T) => {
  type B = `${T}Identifier`
  return Schema.String.pipe(
    Schema.brand(`${of}Identifier` as B),
    Schema.propertySignature,
    Schema.withConstructorDefault(() => {
      type A = string & Brand.Brand<B>
      const brand = Brand.nominal<A>()
      return brand(randomUUID() as Brand.Brand.Unbranded<A>)
    }),
  )
}
