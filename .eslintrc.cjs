module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: ['airbnb-base'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'no-console': 'off',
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
        'import/extensions': ['error', 'ignorePackages'], // import './a.js'; handle ext of file
        'max-len': ['error', { ignoreComments: true, code: 130 }],
        'import/no-unresolved': [2, { ignore: ['got'] }],
        'import/prefer-default-export': 'off',
        'no-await-in-loop': 'off',
        'no-restricted-syntax': 'off',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'guard-for-in': 'off',
        'class-methods-use-this': ['off'],
        'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
        'no-constant-condition': ['off'],
        indent: ['error', 4],
    },
};
