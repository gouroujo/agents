# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Build all: `npx nx run-many -t build`
- Build single library: `npx nx build @agenticz/core`
- Lint: `npx nx lint <project-name>`
- Test: `npx nx test <project-name>` (when tests are added)
- Test single file: `npx nx test <project-name> --testFile=path/to/spec.ts`
- Serve app: `npx nx serve <app-name>` (when apps are added)

## Style Guidelines
- Use TypeScript with strict type checking
- Follow functional programming principles with Effect.js
- Use single quotes for strings
- Use named imports (e.g., `import { pipe } from 'effect'`)
- Use path aliases for internal imports (e.g., `import { X } from '@agenticz/core'`)
- Follow ESLint/Prettier configuration for formatting
- Use NX workspace patterns for library organization
- Prefer immutable data structures and pure functions
- Use async/await for asynchronous code when not using Effect
- Name files using kebab-case.ts
- Use PascalCase for interfaces, types, and classes
- Use camelCase for variables, functions, and methods
- Respect the SOLID principles, avoide Requirement Leakage by using Layers
- Implement end-to-end observability

# Project objectives
- Create a Typescript / Node.JS library to create collaborative teams of autonomous AI agents
- This library should be inspired by the functionnalities proposed by CrewAI but written in a functional way with Effect.js
- This library should be compatible in the future with various LLM provider but will implement only on Ollama integration for test purpose

## Main features
- Create AI Agents
- Create Teams of agents, with a team supervisor
- Allow the use of task planner
- Allow collaboration between Teams and Agents
- Allow creation of tools that can be used by agents