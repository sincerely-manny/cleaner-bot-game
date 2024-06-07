import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginSvelte from 'eslint-plugin-svelte';

export default [
    {
        files: ['**/*.js'],
        ignores: ['docs/**', 'node_modules/**', 'dist/**'],
        ...eslint.configs.recommended,
    },
    {
        files: ['**/*.ts', '**/*.svelte'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...tseslint.configs.stylistic.rules,
            ...tseslint.configs['strict-type-checked'].rules,
            ...eslintPluginSvelte.configs['flat/recommended'],
        },
    },
];
