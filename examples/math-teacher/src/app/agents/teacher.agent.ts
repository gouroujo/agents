import { Injectable } from '@nestjs/common'

import { AIModel, AIAgent } from '@agenticz/core'
import { InjectModel, Tool } from '@agenticz/nest-agenticz'
import { MathToolset } from '../toolsets/math.toolset'

@Injectable()
// @Agent({
//   name: 'Teacher',
//   backstory: '',
//   toolset: [],
// })
export class MathTeacher extends AIAgent {
  protected readonly backstory =
    'You are a recognized teacher in {field}. You are pedagogue and can adapt to the level of your students.'
  protected readonly name = 'Teacher'
  constructor(
    private readonly mathService: MathToolset,
    @InjectModel() model: AIModel,
  ) {
    super(model)
  }

  // @Task('Given a specific topic, generate a lesson plan')
  public generateMathQuestion(topic: string) {
    return this.invoke(
      'Generate a mathematical question according to the following topic:' +
        `<topic>${topic}</topic>`,
    )
  }
}
