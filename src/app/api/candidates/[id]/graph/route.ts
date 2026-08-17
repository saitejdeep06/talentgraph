import { NextResponse } from "next/server";
import { queries } from "@/lib/queries";
import { runQuery } from "@/lib/neo4j";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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
      queries.getCandidateGraph,
      {
        candidateId: id,
      }
    );

    if (records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Candidate graph not found.",
        },
        { status: 404 }
      );
    }

    const record = records[0];

    const cleanItems = (items: any[]) => {
      return items
        .filter((item) => item && item.id !== null)
        .map((item) => ({
          ...item,
        }));
    };

    const graph = {
      candidate: {
        id: record.get("candidateId"),
        name: record.get("candidateName"),
        title: record.get("candidateTitle"),
      },

      skills: cleanItems(record.get("skills")),

      projects: cleanItems(record.get("projects")),

      technologies: cleanItems(
        record.get("technologies")
      ),

      companies: cleanItems(
        record.get("companies")
      ),
    };

    return NextResponse.json({
      success: true,
      graph,
    });
  } catch (error) {
    console.error("Candidate graph API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load candidate graph.",
      },
      { status: 503 }
    );
  }
}