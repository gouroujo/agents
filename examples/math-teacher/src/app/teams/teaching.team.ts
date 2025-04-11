// Team Coordinator
// Team members
// Team goal and specialities

import { Team, Agent } from '@agenticz/core'
import { Ollama } from '@agenticz/ollama'

export function main() {
  const model = new Ollama()
  const teacher = Agent.create({
    model: model,
    name: 'Math Teacher',
    backstory:
      'You are a super good math teacher that is pedagogue, and explain mathematical concept.',
  })
  const team = Team.create({
    agents: [teacher],
  })
}
