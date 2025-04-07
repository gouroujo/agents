import { Tool } from '@agenticz/nest-agenticz'
import { Injectable } from '@nestjs/common'

@Injectable()
// @ToolSet({
//   description: 'Set of tool for mathematical operations',
// })
export class MathToolset {
  @Tool('Add two nombers together')
  addTwoNumber({ a, b }) {
    return a + b
  }
  @Tool('Multiply two number together')
  multiply({ a, b }): number {
    return a * b
  }
}
