import { NextResponse } from "next/server";
import { queries } from "@/lib/queries";
import { runQuery } from "@/lib/neo4j";

function toNumber(value: any): number {
  if (typeof value === "number") {
    return value;
  }

  if (value && typeof value.toNumber === "function") {
    return value.toNumber();
  }

  if (value && typeof value.low === "number") {
    return value.low;
  }

  return Number(value ?? 0);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
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

    const candidateRecords = await runQuery(
      queries.getCandidateById,
      {
        candidateId: id,
      }
    );

    if (candidateRecords.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Candidate not found.",
        },
        { status: 404 }
      );
    }

    const candidateRecord = candidateRecords[0];

    const projectRecords = await runQuery(
      queries.getCandidateProjects,
      {
        candidateId: id,
      }
    );

    const companyRecords = await runQuery(
      queries.getCandidateCompanies,
      {
        candidateId: id,
      }
    );

    const candidate = {
      id: candidateRecord.get("id"),
      name: candidateRecord.get("name"),
      title: candidateRecord.get("title"),
      location: candidateRecord.get("location"),
      experience: toNumber(candidateRecord.get("experience")),

      skills: candidateRecord
        .get("skills")
        .filter((skill: any) => skill.id !== null)
        .map((skill: any) => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
        })),

      projects: projectRecords.map((record: any) => ({
        id: record.get("projectId"),
        name: record.get("projectName"),
        description: record.get("description"),
        technologies: record.get("technologies"),
      })),

      companies: companyRecords.map((record: any) => ({
        id: record.get("id"),
        name: record.get("name"),
        industry: record.get("industry"),
      })),
    };

    return NextResponse.json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Candidate details API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load candidate details.",
      },
      { status: 503 }
    );
  }
}