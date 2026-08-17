import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET() {
  try {
    const serverInfo = await driver.getServerInfo();

    return NextResponse.json({
      success: true,
      message: "Successfully connected to CognoDB!",
      server: {
        address: serverInfo.address,
        agent: serverInfo.agent,
        protocolVersion: serverInfo.protocolVersion,
      },
    });
  } catch (error) {
    console.error("CognoDB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to CognoDB.",
      },
      { status: 503 }
    );
  }
}