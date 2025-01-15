import { Client, QueryConfig, QueryResult } from "pg";

async function query(
  queryObject: string | QueryConfig
): Promise<QueryResult<any>> {
  let client: Client | undefined;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to execute database query");
  } finally {
    if (client) {
      await client.end().catch((endError) => {
        console.error("Error closing the database connection:", endError);
      });
    }
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT)
      : undefined,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};
export default database;

function getSSLValues() {
  if (process.env.NODE_ENV === "production") {
    return {
      rejectUnauthorized: false,
    };
  }
  return false;
}