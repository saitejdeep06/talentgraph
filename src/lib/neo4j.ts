import { driver } from "./cognodb";
import type { Record as Neo4jRecord } from "neo4j-driver";

export async function runQuery(
  query: string,
  parameters: Record<string, unknown> = {}
): Promise<Neo4jRecord[]> {
  const session = driver.session();

  try {
    const result = await session.run(query, parameters);
    return result.records;
  } finally {
    await session.close();
  }
}