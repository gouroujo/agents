import {
  ChatResponse,
  Ollama as OllamaClient,
  Config as OllamaConfig,
  Message as OllamaMessage,
} from 'ollama'

import {
  AssistantMessage,
  getThread,
  InvokeOptions,
  Message,
  Model,
  Thread,
  ThreadOrMessage,
} from '@agenticz/core'
import { z } from 'zod'

export class Ollama extends Model {
  private readonly client: OllamaClient
  constructor(config?: OllamaConfig) {
    super()
    this.client = new OllamaClient(config)
  }

  async invoke(
    threadOrMessage: ThreadOrMessage,
    options?: Omit<InvokeOptions, 'structuredOutput'>,
  ): Promise<AssistantMessage>
  async invoke<Output extends z.AnyZodObject>(
    threadOrMessage: ThreadOrMessage,
    options?: Omit<InvokeOptions, 'structuredOutput'> & {
      structuredOutput: Output
    },
  ): Promise<AssistantMessage<z.infer<Output>>> {
    const thread = getThread(threadOrMessage)
    const response = await this.client.chat({
      model: 'llama3.2',
      messages: thread.messages.map(this.mapMessage),
    })

    if (options?.structuredOutput) {
      const message = AssistantMessage.create<z.infer<Output>>(response.message)
      thread.append(message)
      return message
    }
    const message = AssistantMessage.create(response.message)
    thread.append(message)
    return message
  }

  mapMessage(message: Message): OllamaMessage {
    const msg = message.format(this.formating)
    return {
      role: msg.type,
      content: msg.content,
    }
  }
}
