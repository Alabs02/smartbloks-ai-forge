import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  setupFiles: ["<rootDir>/src/log/index.ts"]
};

export default config;
