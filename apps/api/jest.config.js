const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFiles: ["dotenv/config"],
  moduleNameMapper: {
    "^@graphql/(.*)$": "<rootDir>/src/graphql/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/__tests__/**/*Test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  maxWorkers: 1,
};
