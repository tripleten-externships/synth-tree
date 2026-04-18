module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  passWithNoTests: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
