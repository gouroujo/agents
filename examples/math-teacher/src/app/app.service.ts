import { Inject, Injectable } from '@nestjs/common'
import { MathTeacher } from './agents/teacher.agent'

@Injectable()
export class AppService {
  constructor(@Inject() private readonly teacher: MathTeacher) {}

  async getData() {
    return { message: await this.teacher.generateMathQuestion('derivative') }
  }
}
