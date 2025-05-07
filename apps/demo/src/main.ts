/**
 * Demo application for Agenticz
 *
 * This demo showcases the functionality of configurable autonomous agents
 * using the Ollama integration for local LLM testing.
 */

// Import from our libraries
import { Agent } from '@agenticz/core'
import { OllamaClient, OllamaCompletion } from '@agenticz/ollama'
import { NodeHttpClient } from '@effect/platform-node'

import { Effect, Layer, pipe } from 'effect'

const Llama32 = OllamaCompletion.model('llama3.2')

const Ollama = OllamaClient.layerConfig()
const OllamaWithHttp = Layer.provide(Ollama, NodeHttpClient.layerUndici)
/**
 * Main function to run the demo
 */
// async function main() {
//   const agent = Agent.make({
//     backstory: 'You tell joke',
//   })
//   const task = Task.make({ description: 'Tell me a joke' })

//   const program = agent.execute(task)
//   const runnable = program.pipe(Effect.provide(OllamaProvider))
//   const result = await Effect.runPromise(runnable)
//   console.log(result)
// }

const main = Effect.gen(function* () {
  console.log('dqdqw')
  // Build the `AiModel` into a `Provider`
  const llama = yield* Llama32
  console.log(llama)
  // Provide the implementation of `Completions` to `generateDadJoke`
  const agent = Agent.make({
    backstory: 'You tell joke',
    model: llama as any,
  })
  console.log('aaa')
  const response = yield* agent.execute('Tell me a joke')
  console.log('bbb', response)
  return response
})

// Run the demo
// main.pipe(
//   Effect.withConfigProvider(
//     ConfigProvider.fromMap(
//       new Map([
//         ['APIKEY', 'ollama'],
//         ['APIURL', 'http://localhost:11434/v1/'],
//       ]),
//     ).pipe(ConfigProvider.constantCase),
//   ),
//   Effect.provide(OllamaWithHttp),
//   Effect.runPromise,
// )

pipe(main, Effect.provide(OllamaWithHttp), Effect.runPromise)
