# AgenticzJS Architecture

This document outlines the architecture for the AgenticzJS library, a TypeScript/Node.js library designed to create collaborative teams of autonomous AI agents using functional programming principles with Effect.js.

## Core Architecture

The library follows a layered architecture with clear separation of concerns:

```
┌────────────────────────────────────────────────────────────────┐
│                       Public API Layer                         │
├────────────────────────────────────────────────────────────────┤
│                        Domain Layer                            │
├────────────────────────────────────────────────────────────────┤
│                     Application Layer                          │
├────────────────────────────────────────────────────────────────┤
│                     Infrastructure Layer                       │
└────────────────────────────────────────────────────────────────┘
```

### Layers

1. **Infrastructure Layer**
   - Handles external integrations (LLM providers, storage, etc.)
   - Implements concrete adapters for interfaces defined in the application layer
   - Manages I/O operations and external services communication

2. **Application Layer**
   - Contains core business logic
   - Defines interfaces for infrastructure components
   - Orchestrates the flow of data and operations

3. **Domain Layer**
   - Defines entities, value objects, and domain services
   - Implements domain-specific logic
   - Contains no dependencies on other layers

4. **Public API Layer**
   - Exposes a clean, consistent interface for library consumers
   - Hides implementation details
   - Provides factory functions and builders

## Core Components

### Agent Module

```
┌──────────────────────────────────────────────┐
│                   Agent                      │
├──────────────────────────────────────────────┤
│ - id: string                                 │
│ - name: string                               │
│ - description: string                        │
│ - role: string                               │
│ - goals: Goal[]                              │
│ - tools: Tool[]                              │
│ - memory: Memory                             │
│ - model: LLMModel                            │
│ - backoff: BackoffStrategy                   │
│ - maxRetries: number                         │
├──────────────────────────────────────────────┤
│ + executeTask(task: Task): Effect<Error, Result> │
│ + useMemory(): Effect<Error, MemoryData>     │
│ + useTool(tool: Tool): Effect<Error, Result> │
│ + getContext(): Effect<Error, Context>       │
│ + delegate(task: Task, agent: Agent): Effect<Error, Result> │
└──────────────────────────────────────────────┘
```

### Team Module

```
┌──────────────────────────────────────────────┐
│                   Team                       │
├──────────────────────────────────────────────┤
│ - id: string                                 │
│ - name: string                               │
│ - description: string                        │
│ - agents: Agent[]                            │
│ - supervisor: Agent                          │
│ - planner: TaskPlanner                       │
│ - sharedMemory: Memory                       │
│ - strategy: CollaborationStrategy            │
│ - maxConcurrency: number                     │
├──────────────────────────────────────────────┤
│ + executeTask(task: Task): Effect<Error, Result> │
│ + addAgent(agent: Agent): Effect<Error, Team>│
│ + removeAgent(agentId: string): Effect<Error, Team> │
│ + collaborate(): Effect<Error, Result>       │
│ + assignTask(task: Task, agent: Agent): Effect<Error, void> │
│ + getTeamContext(): Effect<Error, TeamContext> │
│ + processFeedback(feedback: Feedback): Effect<Error, void> │
└──────────────────────────────────────────────┘
```

### Task Planning Module

```
┌──────────────────────────────────────────────┐
│               TaskPlanner                    │
├──────────────────────────────────────────────┤
│ - model: LLMModel                            │
│ - planningStrategy: PlanningStrategy         │
├──────────────────────────────────────────────┤
│ + createPlan(task: Task): Effect<Error, Plan>│
│ + optimizePlan(plan: Plan): Effect<Error, Plan> │
└──────────────────────────────────────────────┘
```

### Tool Module

```
┌──────────────────────────────────────────────┐
│                   Tool                       │
├──────────────────────────────────────────────┤
│ - id: string                                 │
│ - name: string                               │
│ - description: string                        │
│ - parameters: Parameter[]                    │
│ - implementation: Function                   │
├──────────────────────────────────────────────┤
│ + execute(params: any): Effect<Error, Result>│
└──────────────────────────────────────────────┘
```

### Memory Module

```
┌──────────────────────────────────────────────┐
│                  Memory                      │
├──────────────────────────────────────────────┤
│ - id: string                                 │
│ - storage: MemoryStorage                     │
├──────────────────────────────────────────────┤
│ + add(data: any): Effect<Error, void>        │
│ + get(query: Query): Effect<Error, MemoryData> │
│ + clear(): Effect<Error, void>               │
└──────────────────────────────────────────────┘
```

### LLM Integration Module

```
┌──────────────────────────────────────────────┐
│               LLMProvider                    │
├──────────────────────────────────────────────┤
│ - id: string                                 │
│ - name: string                               │
│ - config: ProviderConfig                     │
├──────────────────────────────────────────────┤
│ + generateResponse(prompt: string, params: ModelParams): │
│   Effect<Error, string>                      │
└──────────────────────────────────────────────┘
```

## Communication Flow

1. **Agent-Tool Communication**
   ```
   Agent --[request]--> Tool --[execute]--> Result --[return]--> Agent
   ```

2. **Agent-Team Communication**
   ```
   Team --[task]--> Agent --[execute]--> Result --[return]--> Team
   ```

3. **Agent-Agent Communication**
   ```
   Agent --[delegate]--> Agent --[execute]--> Result --[return]--> Agent
   ```

4. **Team Collaboration**
   ```
   Team --[planning]--> TaskPlanner --[plan]--> Team
   Team --[tasks]--> Agents --[results]--> Team --[synthesis]--> Final Result
   ```

5. **Human-in-the-Loop Feedback**
   ```
   Team --[result]--> Human --[feedback]--> Team --[adjust]--> Execution
   ```

6. **LLM Integration**
   ```
   Agent --[prompt]--> LLMProvider --[response]--> Agent
   ```

## Observability

The library implements end-to-end observability using Effect.js's built-in tracing capabilities:

```
┌────────────────────────────┐
│      Logging Layer         │
├────────────────────────────┤
│      Metrics Layer         │
├────────────────────────────┤
│      Tracing Layer         │
└────────────────────────────┘
```

## Human-in-the-Loop Integration

The library supports human supervision and feedback loops:

```
┌──────────────────────────────────────────────┐
│               HumanInterface                 │
├──────────────────────────────────────────────┤
│ - id: string                                 │
│ - name: string                               │
│ - config: HumanInterfaceConfig               │
├──────────────────────────────────────────────┤
│ + requestFeedback(context: Context): Effect<Error, Feedback> │
│ + requestApproval(plan: Plan): Effect<Error, boolean> │
│ + notifyProgress(progress: Progress): Effect<Error, void> │
└──────────────────────────────────────────────┘
```

## Extension Points

The architecture is designed with extension points to allow future integrations:

1. **LLM Providers**: Pluggable providers beyond Ollama
2. **Memory Storage**: Different storage backends for agent memory
3. **Planning Strategies**: Various planning algorithms
4. **Tools**: Custom tools for specific domains
5. **Team Collaboration Patterns**: Different ways to organize agent collaboration
6. **Human Interface Adapters**: Different methods for human-in-the-loop interaction
7. **Vectorization Services**: Different embedding models and vector stores

## Package Structure

```
@agenticz/core
├── agent
├── team
├── task
├── tool
├── memory
├── llm
│   └── provider
├── human
├── collaboration
│   ├── strategies
│   └── patterns
├── vectorization
└── utils

@agenticz/ollama
└── provider
```