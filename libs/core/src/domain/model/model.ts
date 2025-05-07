import * as Effect from 'effect/Effect'
import { CommitPrototype } from 'effect/Effectable'
import { Pipeable, pipeArguments } from 'effect/Pipeable'
import * as Context from 'effect/Context'
import * as Scope from 'effect/Scope'

type ContextBuilder<Provides, Requires> = Effect.Effect<
  Context.Context<Provides>,
  never,
  Requires | Scope.Scope
>

const TypeId: unique symbol = Symbol.for('@agenticz/AIModel')
export interface AIModel<in out Provides, in out Requires>
  extends Pipeable,
    Effect.Effect<Provides, never, Requires> {
  readonly [TypeId]: typeof TypeId
  readonly model: string
  readonly cacheKey: symbol
  readonly requires: Context.Tag<Requires, any>
  readonly provides: ContextBuilder<Provides, Requires>
}

export const make = <Provides, Requires>(options: {
  readonly model: string
  readonly cacheKey: symbol
  readonly requires: Context.Tag<Requires, any>
  readonly provides: ContextBuilder<Provides, Requires>
}): AIModel<Provides, Requires> => {
  return Object.assign(Object.create(CommitPrototype), {
    [TypeId]: TypeId,
    commit(this) {
      return this
    },
    pipe() {
      // eslint-disable-next-line prefer-rest-params
      return pipeArguments(this, arguments)
    },
    model: options.model,
    cacheKey: options.cacheKey,
    requires: options.requires,
    provides: options.provides,
  })
}
