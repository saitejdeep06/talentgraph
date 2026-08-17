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
          message: "Job ID is required.",
        },
        { status: 400 }
      );
    }

    const records = await runQuery(
      queries.matchCandidatesToJob,
      {
        jobId: id,
      }
    );

    const matches = records.map((record: any) => ({
      candidateId: record.get("candidateId"),
      candidateName: record.get("candidateName"),
      candidateTitle: record.get("candidateTitle"),
      location: record.get("location"),

      experience: toNumber(
        record.get("experience")
      ),

      matchedSkillCount: toNumber(
        record.get("matchedSkillCount")
      ),

      requiredSkillCount: toNumber(
        record.get("requiredSkillCount")
      ),

      matchPercentage: toNumber(
        record.get("matchPercentage")
      ),
    }));

    return NextResponse.json({
      success: true,
      jobId: id,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error(
      "Candidate matching API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to calculate candidate matches.",
      },
      { status: 503 }
    );
  }
}