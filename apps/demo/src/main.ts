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
import { NodeSdk } from '@effect/opentelemetry'
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { Context, Effect, Layer, pipe } from 'effect'

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
  const llama = yield* Llama32
  const agent = Agent.make(llama)
  const response = yield* agent.exececute('Tell me a joke')
  console.log(response)
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
