import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents, states, edges } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;

    // Get agent details
    const agent = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (!agent.length) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Get states
    const agentStates = await db
      .select()
      .from(states)
      .where(eq(states.agentId, agentId));

    // Get edges
    const agentEdges = await db
      .select()
      .from(edges)
      .where(eq(edges.agentId, agentId));

    return NextResponse.json({
      ...agent[0],
      states: agentStates,
      edges: agentEdges,
    });
  } catch (error) {
    console.error("Failed to fetch agent:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const {
      name,
      globalPrompt,
      states: newStates,
      edges: newEdges,
    } = await request.json();

    // Update agent
    await db
      .update(agents)
      .set({ name, globalPrompt, updatedAt: new Date() })
      .where(eq(agents.id, agentId));

    // Delete existing states and edges (we'll replace them)
    await db.delete(states).where(eq(states.agentId, agentId));
    await db.delete(edges).where(eq(edges.agentId, agentId));

    // Insert new states
    if (newStates && newStates.length > 0) {
      await db.insert(states).values(
        newStates.map((state: any) => ({
          agentId,
          name: state.data.label,
          prompt: state.data.prompt,
          isInitial: state.data.isInitial,
          position: { x: state.position.x, y: state.position.y },
          id: state.id,
        }))
      );
    }

    // Insert new edges
    if (newEdges && newEdges.length > 0) {
      await db.insert(edges).values(
        newEdges.map((edge: any) => ({
          agentId,
          sourceId: edge.source,
          targetId: edge.target,
          intent: edge.data?.intent || "",
          id: edge.id,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}
