module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
};
