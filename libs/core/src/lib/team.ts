import { Agent } from './agent.js'
import { Invokable, InvokeOptions } from './interfaces/index.js'
import { Message } from './messages/message.js'
import { Model } from './model'
import { Supervisor } from './supervisor.js'
import { getThread, Thread, ThreadOrMessage } from './thread.js'

type TeamOptions<Agents extends Agent> = {
  name: string
  backstory: string
  agents: Agents[]
} & (
  | {
      model: Model
      supervisor?: never
    }
  | {
      model?: never
      supervisor: Supervisor<Agents>
    }
)

export class Team<Agents extends Agent> implements Invokable {
  public readonly name: string
  private readonly backstory: string
  private readonly supervisor: Supervisor<Agents>
  private readonly agents = new Map<Agents['name'], Agents>()

  protected constructor(options: TeamOptions<Agents>) {
    this.name = options.name
    this.backstory = options.backstory
    this.supervisor =
      options.supervisor ??
      Supervisor.create({
        model: options.model,
        agents: options.agents,
      })
  }

  async invoke(
    threadOrMessage: ThreadOrMessage,
    options?: InvokeOptions,
  ): Promise<Thread> {
    const thread = getThread(threadOrMessage)
    const supervisorDecison = await this.supervisor.invoke(thread)
    if (supervisorDecison.done) {
      return thread
    }

    if (!supervisorDecison.next)
      throw new Error(`Next agent ${supervisorDecison.next}`)
    const next = this.agents.get(supervisorDecison.next)
    if (!next) throw new Error(`Next agent ${supervisorDecison.next} not found`)

    await next.invoke(thread, options)
    return this.invoke(thread, options)
  }

  add<T extends Agent>(agents: T[]): Team<Agents | T> {
    return Team.create({
      name: this.name,
      backstory: this.backstory,
      supervisor: this.supervisor, // TODO: extend supervisor with the new agents
      agents: [...this.agents.values(), ...agents],
    })
  }

  static create<A extends Agent, O extends TeamOptions<A>>(
    options: O,
  ): Team<A> {
    return new Team(options)
  }
}

//  pass <context> when calling team agent
