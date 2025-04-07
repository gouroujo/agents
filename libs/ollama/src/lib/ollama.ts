import { Ollama as OllamaClient, Config } from 'ollama'

import { AIModel } from '@agenticz/core'

export class Ollama extends AIModel {
  private readonly client: OllamaClient
  constructor(config?: Config) {
    super()
    this.client = new OllamaClient(config)
  }

  async invoke(prompt: string) {
    const response = await this.client.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: prompt }],
    })
    return response.message.content
  }
}
