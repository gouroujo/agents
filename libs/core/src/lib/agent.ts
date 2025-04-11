import { z } from 'zod'
import { Tool } from './interfaces/tool.interface'
import { Model } from './model'
import { Thread } from './thread'
import { SystemMessage, Message } from './messages'
import { Invokable, InvokeOptions } from './interfaces'

const AgentOptionSchema = z
  .object({
    model: z.instanceof(Model).describe('Default Model used by the Agent'),
    name: z.string().describe('Name of the agent').nonempty(),
    backstory: z.string().describe('Backstory of the agent').nonempty(),
  })
  .required()
  .strict()

type AgentOptions = z.infer<typeof AgentOptionSchema>

export class Agent implements Invokable {
  private readonly defaultModel: Model
  public readonly name: string
  public readonly backstory: string
  private readonly tools = new Map<string, Tool>()

  constructor(options: AgentOptions) {
    this.defaultModel = options.model
    this.name = options.name
    this.backstory = options.backstory
  }

  async invoke(threadOrMessage: Thread | Message, options?: InvokeOptions) {
    const thread: Thread =
      threadOrMessage instanceof Thread
        ? threadOrMessage
        : Thread.create([threadOrMessage])
    thread.prepend(SystemMessage.create({ backstory: this.backstory }))
    await this.defaultModel.invoke(thread, options)
    return thread
  }

  static create(options: AgentOptions): Agent {
    // TODO: validate options with zod and return error if fl
    return new Agent(options)
  }
}
