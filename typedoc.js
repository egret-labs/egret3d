module.exports = {
    out: './docs/dist/api/',
    readme: 'none',
    includes: './',
    exclude: [
        '**/editor/**/*',
        '**/__test_utils__/**/*',
        '**/__fixtures__/**/*',
        '**/testsuite/**/*'
    ],

    mode: 'file',
    excludeExternals: true,
    ignoreCompilerErrors: true,
    excludePrivate: true
};