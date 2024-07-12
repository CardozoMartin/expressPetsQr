module.exports = {
    extends: ['eslint:recommended', 'airbnb-base'],
    env: {
      es6: true,
      browser: true,
    },
    rules: {
      'import/extensions': 'off',
      indent: 'off',
      camelcase: 'off',
      'no-restricted-globals': 'off',
      'import/prefer-default-export': 'off',
      'no-underscore-dangle': 'off',
      'no-console': 'off',
      'no-unused-vars': 2,
      'space-unary-ops': 'off',
    },
    // "linebreak-style": ["error", "unix"],
    ignorePatterns: ['**/node_modules/**', '**/dist/**'],
  };
