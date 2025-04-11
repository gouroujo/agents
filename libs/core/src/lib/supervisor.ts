import { z } from 'zod'
import { Agent } from './agent'
import { Model } from './model'
import { Thread } from './thread'
import { SystemMessage, AssistantMessage } from './messages'
import { Invokable, InvokeOptions } from './interfaces'

export class Supervisor<Agents extends Agent> implements Invokable {
  private readonly defaultModel: Model
  private readonly agents: Agents[]
  public readonly name: string = 'Team Supervisor'
  private readonly backstory: string = `
    You are a supervisor tasked with managing a conversation between the
    available_agent. Given the following conversation,
    respond with the worker to act next. Each worker will perform a
    task and respond with their results and status.
    When finished, respond with \`{ "done": true }\`\n\n
    Select strategically to minimize the number of steps taken.
  `

  constructor(options: { model: Model; agents: Agents[] }) {
    this.defaultModel = options.model
    this.agents = [...options.agents]
  }

  public async invoke(
    thread: Thread,
    options?: InvokeOptions,
  ): Promise<{
    next?: Agents['name']
    instruction?: string
    reasoning: string
    done: boolean
  }> {
    const agentNames = this.agents.map((a) => a.name) as unknown as readonly [
      string,
      ...string[],
    ]
    thread.lock()
    thread.clean()
    thread.prepend(
      SystemMessage.create(this.backstory, {
        available_agent: this.agents.map((agent) => ({
          name: agent.name,
          backstory: agent.backstory,
        })),
      }),
    )
    thread.append(
      SystemMessage.create(
        `Given the conversation above, which available_agent should be called next? Or are we done?`,
      ),
    )
    const answer: AssistantMessage<{
      next?: Agents['name']
      instruction?: string
      reasoning: string
      done: boolean
    }> = await this.defaultModel.invoke(thread, {
      ...options,
      structuredOutput: z.object({
        next: z
          .enum(agentNames)
          .optional()
          .describe('Select the next available_agent to call'),
        instruction: z
          .string()
          .optional()
          .describe(
            'The specific instructions of the sub-task the next available_agent should accomplish',
          ),
        reasoning: z.string(),
        done: z
          .boolean()
          .describe('Flag to indicate if the task has been completed'),
      }),
    })
    thread.unlock()
    return answer.structuredContent
  }

  static create<A extends Agent, O extends { model: Model; agents: A[] }>(
    options: O,
  ): Supervisor<A> {
    return new Supervisor(options)
  }
}
