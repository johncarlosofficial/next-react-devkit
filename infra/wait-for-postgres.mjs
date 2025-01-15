/* eslint-disable no-unused-vars */
import { exec } from "node:child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkPostgres() {
  try {
    const { stdout } = await execAsync(
      "docker exec postgres-dev pg_isready --host localhost",
    );

    if (!stdout.includes("accepting connections")) {
      process.stdout.write(".");
      return checkPostgres();
    }

    console.log("\n🟢 Postgres is ready and accepting connections!\n");
  } catch (error) {
    process.stdout.write(".");
    return checkPostgres();
  }
}

console.log("\n\n🔴 Waiting for Postgres to accept connections");
checkPostgres();
