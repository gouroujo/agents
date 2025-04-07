import { Injectable } from '@nestjs/common'

import { AIModel, AIAgent } from '@agenticz/core'

@Injectable()
export class CoordinatorAgent extends AIAgent {
  protected readonly backstory = 'You are a teaching coordinator'
  protected readonly name = 'Teaching coordinator'
  // constructor(@InjectModel() model: AIModel) {
  //   super(model)
  // }

  // @Task('Find the concerned field of study and the exact subject')
  public generateMathQuestion(topic: string) {
    return this.invoke(
      'Generate a mathematical question according to the following topic:' +
        `<topic>${topic}</topic>`,
    )
  }
}
