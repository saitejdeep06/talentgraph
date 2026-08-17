import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function GET() {
  try {
    const records = await runQuery(`
      MATCH (j:Job)
      RETURN
        j.id AS id,
        j.title AS title,
        j.company AS company,
        j.location AS location,
        j.description AS description
      ORDER BY j.id
    `);

    const jobs = records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      company: record.get("company"),
      location: record.get("location"),
      description: record.get("description"),
    }));

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Jobs API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch jobs from CognoDB.",
      },
      { status: 503 }
    );
  }
}
