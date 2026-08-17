import { NextResponse } from "next/server";
import { queries } from "@/lib/queries";
import { runQuery } from "@/lib/neo4j";

export async function GET() {
  try {
    const records = await runQuery(
      queries.getDashboardStats,
      {}
    );

    if (records.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          candidates: 0,
          jobs: 0,
          skills: 0,
          projects: 0,
          technologies: 0,
          companies: 0,
        },
      });
    }

    const record = records[0];

    const toNumber = (value: any): number => {
      if (value && typeof value.toNumber === "function") {
        return value.toNumber();
      }

      return Number(value ?? 0);
    };

    return NextResponse.json({
      success: true,
      stats: {
        candidates: toNumber(record.get("candidates")),
        jobs: toNumber(record.get("jobs")),
        skills: toNumber(record.get("skills")),
        projects: toNumber(record.get("projects")),
        technologies: toNumber(record.get("technologies")),
        companies: toNumber(record.get("companies")),
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load dashboard statistics.",
      },
      { status: 503 }
    );
  }
}