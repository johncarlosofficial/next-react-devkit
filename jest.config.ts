import dotenv from "dotenv";
import nextJest from "next/jest";

dotenv.config({ path: ".env.development" });

const createJestConfig = nextJest({ dir: "." });

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(customJestConfig);
