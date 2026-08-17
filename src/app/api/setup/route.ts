import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

const schemaQueries = [
  `
  CREATE CONSTRAINT candidate_id_unique IF NOT EXISTS
  FOR (c:Candidate)
  REQUIRE c.id IS UNIQUE
  `,
  `
  CREATE CONSTRAINT skill_id_unique IF NOT EXISTS
  FOR (s:Skill)
  REQUIRE s.id IS UNIQUE
  `,
  `
  CREATE CONSTRAINT job_id_unique IF NOT EXISTS
  FOR (j:Job)
  REQUIRE j.id IS UNIQUE
  `,
  `
  CREATE CONSTRAINT company_id_unique IF NOT EXISTS
  FOR (c:Company)
  REQUIRE c.id IS UNIQUE
  `,
  `
  CREATE CONSTRAINT project_id_unique IF NOT EXISTS
  FOR (p:Project)
  REQUIRE p.id IS UNIQUE
  `,
  `
  CREATE CONSTRAINT technology_id_unique IF NOT EXISTS
  FOR (t:Technology)
  REQUIRE t.id IS UNIQUE
  `,
];

export async function POST() {
  const session = driver.session();

  try {
    for (const query of schemaQueries) {
      await session.run(query);
    }

    return NextResponse.json({
      success: true,
      message: "TalentGraph schema created successfully.",
    });
  } catch (error) {
    console.error("Schema creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create TalentGraph schema.",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}