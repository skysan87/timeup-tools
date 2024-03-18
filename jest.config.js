/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // https://jestjs.io/ja/docs/configuration#projects-arraystring--projectconfig
  projects: [
    '<rootDir>/packages/*',
    '<rootDir>/apps/*'
  ]
}