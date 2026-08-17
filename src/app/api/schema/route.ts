import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(
      "SHOW CONSTRAINTS"
    );

    const constraints = result.records.map((record) =>
      record.toObject()
    );

    return NextResponse.json({
      success: true,
      count: constraints.length,
      constraints,
    });
  } catch (error) {
    console.error("Constraint verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify schema.",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}