# Agenticz Demo

This demo showcases the functionality of the AgenticzJS library - a TypeScript framework for building autonomous AI agents.

## Features Demonstrated

- Creating configurable autonomous agents with customizable parameters
- Connecting agents to Ollama for local model testing
- Basic prompt construction and response handling
- Simple task execution with clear instructions
- End-to-end observability on agent behavior

## Running the Demo

### Prerequisites

- Node.js 16+
- [Ollama](https://ollama.ai/) installed and running locally
- The `llama3` model pulled in Ollama

### Running the demo

```bash
# Make sure Ollama is running in another terminal
ollama serve

# Pull the llama3 model if you don't have it yet
ollama pull llama3

# Run the demo
npx nx serve demo
```

## What the demo does

1. Creates a "Research Assistant" agent with specific goals and traits
2. Connects the agent to Ollama using the llama3 model
3. Assigns a research task about functional programming
4. Executes the task and displays the result and execution metrics
