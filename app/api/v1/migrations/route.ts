import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

export async function GET() {
  const pendingMigrations = await runMigrations(true);
  return new Response(JSON.stringify(pendingMigrations), { status: 200 });
}

export async function POST() {
  const migratedMigrations = await runMigrations(false);

  const status = migratedMigrations.length > 0 ? 201 : 200;
  return new Response(JSON.stringify(migratedMigrations), { status });
}

const runMigrations = async (dryRun: boolean) => {
  const dbClient = await database.getNewClient();
  try {
    return await migrationRunner({
      dbClient,
      dryRun,
      dir: resolve("infra", "migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
    });
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    await dbClient.end();
  }
};
