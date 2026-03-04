const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // must be jsdom for React components
  moduleNameMapper: {
    // Use TypeScript paths, plus escape parentheses in folder names
    "^@/(.*)$": "<rootDir>/$1",
    "^@/app/\\(auth\\)/(.*)$": "<rootDir>/app/(auth)/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // optional: for RTL and mocks
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};