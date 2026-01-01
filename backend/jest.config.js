// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// module.exports = {
//   testEnvironment: "node",
//   extensionsToTreatAsEsm: ['.ts'],
//   transform: {
//     ...tsJestTransformCfg,
//   },
//    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
// };


// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// module.exports = {
//   testEnvironment: "node",
//   extensionsToTreatAsEsm: ['.ts'],
//   globals: {
//     'ts-jest': {
//       useESM: true
//     }
//   },
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
//   transform: {
//     ...tsJestTransformCfg,
//   },
//   transformIgnorePatterns: [
//     'node_modules/(?!(ajv)/)'
//   ]
// };



// /** @type {import('ts-jest').JestConfigWithTsJest} */
// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
//   },
//   extensionsToTreatAsEsm: ['.ts'],
//   globals: {
//     'ts-jest': {
//       useESM: true,
//       tsconfig: './tsconfig.json',
//     },
//   },
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   },
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // Use the ESM preset provided by ts-jest
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  
  // This tells Jest which extensions to treat as ESM
  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    // This resolves the .js extensions in your TypeScript imports 
    // (required by "module": "nodenext")
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    // Configure ts-jest to use ESM
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};