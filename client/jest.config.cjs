module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { configFile: './babel.config.cjs' }]
  }
};
