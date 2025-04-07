import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents, states, edges } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import OpenAI from "openai";
import { error } from "console";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { agentId, message, currentStateId } = await request.json();

    // Get agent details
    const agent = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent.length) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Get current state
    let currentState;
    if (currentStateId) {
      const stateResult = await db
        .select()
        .from(states)
        .where(and(eq(states.id, currentStateId), eq(states.agentId, agentId)))
        .limit(1);

      if (stateResult.length) {
        currentState = stateResult[0];
      }
    } else {
      // Get initial state
      const initialState = await db
        .select()
        .from(states)
        .where(and(eq(states.isInitial, true), eq(states.agentId, agentId)))
        .limit(1);

      if (initialState.length) {
        currentState = initialState[0];
      }
    }

    if (!currentState) {
      return NextResponse.json(
        { error: "No valid state found" },
        { status: 400 }
      );
    }

    // Get all possible transitions from current state
    const possibleEdges = await db
      .select()
      .from(edges)
      .where(
        and(eq(edges.sourceId, currentState.id), eq(edges.agentId, agentId))
      );

    // Prepare system message with global prompt and state prompt
    const systemMessage = `${agent[0].globalPrompt}\n\nCurrent state: ${currentState.name}\n${currentState.prompt}`;

    // Prepare function for state transitions
    const functions = [
      {
        name: "transition_state",
        description: "Transition to a new state based on user intent",
        parameters: {
          type: "object",
          properties: {
            intent: {
              type: "string",
              enum: possibleEdges.map((edge) => edge.intent),
              description:
                "The detected intent that should trigger a state transition",
            },
          },
          required: ["intent"],
        },
      },
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      functions: possibleEdges.length > 0 ? functions : undefined,
      function_call: possibleEdges.length > 0 ? "auto" : undefined,
    });

    const responseMessage = response.choices[0].message;

    // Check if there's a function call for state transition
    if (
      responseMessage.function_call &&
      responseMessage.function_call.name === "transition_state"
    ) {
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);
      const intent = functionArgs.intent;

      // Find the edge with this intent
      const matchingEdge = possibleEdges.find((edge) => edge.intent === intent);

      if (matchingEdge) {
        // Return the content and the next state ID
        return NextResponse.json({
          content:
            responseMessage.content || "I need to change how I respond to you.",
          nextStateId: matchingEdge.targetId,
        });
      }
    }

    // If no function call or no matching edge, just return the content
    return NextResponse.json({
      content: responseMessage.content,
      nextStateId: currentState.id, // Stay in the same state
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
