import {
  DynamicModule,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common'
import {
  ConfigurableModuleClass,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} from './agenticz.module-definition'
import { ModuleRef } from '@nestjs/core'
import { AIAgent } from '@agenticz/core'
import { DEFAULT_MODEL_TOKEN } from './decorators/constants'

@Module({
  providers: [],
  exports: [],
})
export class AgenticzModule
  extends ConfigurableModuleClass
  implements OnApplicationShutdown
{
  private readonly logger = new Logger('AgenticzModule')
  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const module = super.register(options)
    return {
      ...module,
      providers: [
        { provide: DEFAULT_MODEL_TOKEN, useValue: options.defaultModel },
        ...(module.providers ? module.providers : []),
      ],
      exports: [DEFAULT_MODEL_TOKEN, ...(module.exports ? module.exports : [])],
    }
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.registerAsync(options),
    }
  }

  async onApplicationShutdown(): Promise<void> {
    this.logger.log('Shutting down agents...')
    // TODO : shutdown all agents

    // const dataSource = this.moduleRef.get<AIAgent>(
    //   getDataSourceToken(this.options as DataSourceOptions) as Type<DataSource>,
    // );
    // try {
    //   if (dataSource && dataSource.isInitialized) {
    //     await dataSource.destroy();
    //   }
    // } catch (e) {
    //   this.logger.error(e?.message);
  }
}
