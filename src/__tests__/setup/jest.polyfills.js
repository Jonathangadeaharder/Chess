/**
 * Jest Polyfills
 * Sets up global polyfills before any tests run
 * This file runs BEFORE jest.setup.ts
 */

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Expo's import.meta registry before any imports happen
global.__ExpoImportMetaRegistry = {
  get: jest.fn(() => ({})),
  set: jest.fn(),
  has: jest.fn(() => false),
  delete: jest.fn(),
  clear: jest.fn(),
};

// Mock structuredClone if not available
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = obj => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Mock import.meta itself
global.importMeta = {
  url: 'file://test',
  resolve: jest.fn(path => path),
};

// Suppress React Native warnings in tests
global.__DEV__ = true;

// Mock performance API if not available
if (typeof global.performance === 'undefined') {
  global.performance = {
    now: () => Date.now(),
  };
}

// Mock requestAnimationFrame
if (typeof global.requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = cb => setTimeout(cb, 0);
}

if (typeof global.cancelAnimationFrame === 'undefined') {
  global.cancelAnimationFrame = id => clearTimeout(id);
}

// Mock Expo winter runtime before it loads
jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });
