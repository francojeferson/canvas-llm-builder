# Canvas LLM Builder

A visual interface for building and testing conversational LLM agents with state management. This tool allows users to create, test, and iterate on stateful conversational agents through an intuitive canvas-based interface.

## Overview

Canvas LLM Builder provides a visual interface for designing conversational agents with multiple states and transitions. Users can define different states for their agents, connect them with intents, and test the conversation flow in real-time.

## Features

- **Visual Agent Builder**: Create and connect states to build conversational flows
- **State Management**: Define different states for your agent with specific prompts
- **Intent-Based Transitions**: Create transitions between states based on user intents
- **Real-time Testing**: Test your agent with a chat interface
- **Global and State-Specific Prompts**: Configure both global agent behavior and state-specific instructions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for PostgreSQL database setup)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/francojeferson/canvas-llm-builder.git
   ```

2. Navigate to the project directory:

   ```bash
   cd canvas-llm-builder
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/canvas_llm
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the PostgreSQL database using Docker:

   ```bash
   docker-compose up -d
   ```

5. Install dependencies:

   ```bash
   npm install
   ```

6. Set up the database schema:

   ```bash
   npm run db:push
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open your browser and navigate to `http://localhost:3000`

## Database Management

This project uses Drizzle ORM with PostgreSQL for database management.

### Database Commands

- Generate migrations after schema changes:

  ```bash
  npm run db:generate
  ```

- Push schema changes to the database:

  ```bash
  npm run db:push
  ```

- Open Drizzle Studio to view and manage database:
  ```bash
  npm run db:studio
  ```

## Database Schema

The application uses the following database structure:

- **Agents**: Stores agent configurations with global prompts
- **States**: Stores individual states of an agent with specific prompts
- **Edges**: Stores transitions between states based on intents

## API Endpoints

- `GET /api/agents`: Fetch all agents
- `POST /api/agents`: Create a new agent
- `GET /api/agents/[id]`: Get a specific agent with its states and edges
- `PUT /api/agents/[id]`: Update an agent with its states and edges
- `POST /api/chat`: Process a chat message with a specific agent

## Usage

1. **Create a New Agent**: Define a name and global prompt for your agent
2. **Add States**: Create different states for your agent with specific prompts
3. **Define Transitions**: Connect states with intent-based transitions
4. **Test Your Agent**: Use the test mode to interact with your agent and see how it transitions between states

## Architecture

The application is built with:

- Next.js for the frontend and API routes
- React Flow for the canvas and node system
- Drizzle ORM for database operations
- PostgreSQL database (containerized with Docker)
- Backend API for LLM integration

## Next Steps

1. **Implement State Management**: Use Zustand or React Context to manage the application state across components.
2. **Complete the Save Agent Functionality**: Implement the logic to collect all nodes and edges from the canvas and save them to the database.
3. **Add Agent Loading**: Create functionality to load existing agents from the database.
4. **Enhance the UI**: Add more styling and user experience improvements.
5. **Add Error Handling**: Implement proper error handling throughout the application.
6. **Add Authentication**: Implement user authentication to secure the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Based on the [SuperCallAI Coding Challenge](https://github.com/SuperCallAI/Coding-Challenge/tree/main)
