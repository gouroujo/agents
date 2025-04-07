import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AgenticzModule } from '@agenticz/nest-agenticz'
import { Ollama } from '@agenticz/ollama'
import { MathTeacher } from './agents/teacher.agent'
import { MathToolset } from './toolsets/math.toolset'

@Module({
  imports: [
    AgenticzModule.register({
      defaultModel: new Ollama(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MathTeacher, MathToolset],
})
export class AppModule {}
