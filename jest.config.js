module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
};
