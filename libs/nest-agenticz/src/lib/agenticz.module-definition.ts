import { ConfigurableModuleBuilder } from '@nestjs/common'
import { AgenticzModuleOptions } from './interfaces/agenticz-module-options.interface'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<AgenticzModuleOptions>().build()
