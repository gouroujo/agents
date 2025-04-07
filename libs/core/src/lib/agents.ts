import { AITool } from './interfaces/tool.interface'
import { AIModel } from './model'

export abstract class AIAgent {
  protected abstract readonly name: string
  protected abstract readonly backstory: string
  private readonly tools = new Map<string, AITool>()

  protected constructor(private readonly model: AIModel) {}

  async invoke(task: string) {
    return this.model.invoke(task)
  }

  // static create(model: AIModel): AIAgent {
  //   return new AIAgent(model)
  // }
}
