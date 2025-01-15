import retry from "async-retry";
import database from "infra/database";

const WEB_SERVER_URL = "http://localhost:3000/api/v1/status";
const MAX_RETRIES = 100;
const MAX_TIMEOUT = 1000;

async function waitForAllServices(): Promise<void> {
  await waitForWebServer(WEB_SERVER_URL);
}

async function waitForWebServer(url: string): Promise<void> {
  await retry(
    async () => {
      const response = await fetch(url);
      if (response.status !== 200) {
        throw new Error("Web server is not ready yet.");
      }
    },
    { retries: MAX_RETRIES, maxTimeout: MAX_TIMEOUT }
  );
}

async function clearDatabase(): Promise<void> {
  const query = `
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `;
  await database.query(query);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
