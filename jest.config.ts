import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  // verbose: true,
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_SERVER_BASE_URL: "http://localhost:3001",
                    VITE_BASE_API_URL: "http://localhost:3001/api/",
                    VITE_UPLOAD_PRESET: "somePreset",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
};

export default config;
