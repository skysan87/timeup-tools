/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1"
  },
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json'
    }
  }
}