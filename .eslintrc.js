module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/community',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
