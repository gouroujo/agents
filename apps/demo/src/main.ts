/**
 * Demo application for Agenticz
 *
 * This demo showcases the functionality of configurable autonomous agents
 * using the Ollama integration for local LLM testing.
 */

// Import from our libraries
import { Task, Effect, Agent } from '@agenticz/core'
import { OllamaProvider } from '@agenticz/ollama'

/**
 * Main function to run the demo
 */
async function main() {
  const agent = Agent.make({
    backstory: 'You tell joke',
  })
  const task = Task.make({ description: 'Tell me a joke' })

  const program = agent.execute(task)
  const runnable = program.pipe(Effect.provide(OllamaProvider))
  const result = await Effect.runPromise(runnable)
  console.log(result)
}

// Run the demo
main().catch(console.error)
