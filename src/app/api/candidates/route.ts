import { NextResponse } from "next/server";
import { queries } from "@/lib/queries";
import { runQuery } from "@/lib/neo4j";

export async function GET() {
  try {
    const records = await runQuery(queries.getCandidates);

    const candidates = records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      title: record.get("title"),
      location: record.get("location"),
      experience: record.get("experience"),
    }));

    return NextResponse.json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error("Candidates API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load candidates.",
      },
      { status: 503 }
    );
  }
}