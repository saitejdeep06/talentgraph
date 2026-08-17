import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: candidateId } = await params;
    const jobId = request.nextUrl.searchParams.get("jobId");

    if (!candidateId || !jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "candidateId and jobId are required",
        },
        { status: 400 }
      );
    }

    const records = await runQuery(
      `
      MATCH (j:Job {id: $jobId})
      MATCH (c:Candidate {id: $candidateId})

      OPTIONAL MATCH (j)-[:REQUIRES]->(required:Skill)
      WITH
        j,
        c,
        collect(DISTINCT required) AS requiredSkills

      OPTIONAL MATCH (c)-[:HAS_SKILL]->(candidateSkill:Skill)
      WITH
        j,
        c,
        requiredSkills,
        collect(DISTINCT candidateSkill) AS candidateSkills

      WITH
        j,
        c,
        requiredSkills,
        candidateSkills,
        [skill IN requiredSkills
          WHERE skill.id IN [candidateSkill IN candidateSkills | candidateSkill.id]
        ] AS matchedSkills,
        [skill IN requiredSkills
          WHERE NOT skill.id IN [candidateSkill IN candidateSkills | candidateSkill.id]
        ] AS missingSkills

      RETURN
        c.id AS candidateId,
        c.name AS candidateName,
        j.id AS jobId,
        j.title AS jobTitle,

        [skill IN matchedSkills | {
          id: skill.id,
          name: skill.name,
          category: skill.category
        }] AS matchedSkills,

        [skill IN missingSkills | {
          id: skill.id,
          name: skill.name,
          category: skill.category
        }] AS missingSkills,

        size(matchedSkills) AS matchedSkillCount,
        size(requiredSkills) AS requiredSkillCount,

        CASE
          WHEN size(requiredSkills) = 0 THEN 0
          ELSE 100.0 * size(matchedSkills) / size(requiredSkills)
        END AS matchPercentage
      `,
      {
        candidateId,
        jobId,
      }
    );

    if (records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Candidate or job not found",
        },
        { status: 404 }
      );
    }

    const record = records[0];

    const toNumber = (value: unknown): number => {
      if (value === null || value === undefined) {
        return 0;
      }

      if (typeof value === "number") {
        return value;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        "toNumber" in value &&
        typeof (value as { toNumber: () => number }).toNumber === "function"
      ) {
        return (value as { toNumber: () => number }).toNumber();
      }

      return Number(value);
    };

    return NextResponse.json({
      success: true,
      candidateId: record.get("candidateId"),
      candidateName: record.get("candidateName"),
      jobId: record.get("jobId"),
      jobTitle: record.get("jobTitle"),
      matchedSkills: record.get("matchedSkills") || [],
      missingSkills: record.get("missingSkills") || [],
      matchedSkillCount: toNumber(record.get("matchedSkillCount")),
      requiredSkillCount: toNumber(record.get("requiredSkillCount")),
      matchPercentage: toNumber(record.get("matchPercentage")),
    });
  } catch (error) {
    console.error("Candidate match explanation API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load candidate match explanation",
      },
      { status: 500 }
    );
  }
}
