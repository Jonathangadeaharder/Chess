module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|chess\\.js)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.ts'],
  setupFiles: ['<rootDir>/src/__tests__/setup/jest.polyfills.js'],
  testPathIgnorePatterns: ['/node_modules/', '/setup/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/constants/**',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^expo/src/winter/runtime\\.native$':
      '<rootDir>/src/__tests__/setup/mocks/expo-runtime.mock.js',
    '^expo/src/winter/installGlobal$':
      '<rootDir>/src/__tests__/setup/mocks/expo-install-global.mock.js',
  },
  testEnvironment: 'node',
  globals: {
    __DEV__: true,
  },
};
