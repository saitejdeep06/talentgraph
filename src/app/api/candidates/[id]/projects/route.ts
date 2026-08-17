import { NextResponse } from "next/server";
import { queries } from "@/lib/queries";
import { runQuery } from "@/lib/neo4j";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Candidate ID is required.",
        },
        { status: 400 }
      );
    }

    const records = await runQuery(
      queries.getCandidateProjects,
      {
        candidateId: id,
      }
    );

    const projects = records.map((record) => ({
      projectId: record.get("projectId"),
      projectName: record.get("projectName"),
      description: record.get("description"),
      technologies: record.get("technologies"),
    }));

    return NextResponse.json({
      success: true,
      candidateId: id,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Candidate projects API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load candidate projects.",
      },
      { status: 503 }
    );
  }
}