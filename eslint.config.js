import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            prettier: prettierPlugin,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            // ===== Prettier =====
            'prettier/prettier': 'warn',

            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [['^react', '^next', '^\\w'], ['^']],
                },
            ],
            'simple-import-sort/exports': 'warn',

            // ===== TS =====
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_$',
                    varsIgnorePattern: '^_$',
                    caughtErrorsIgnorePattern: '^_$',
                },
            ],
            '@typescript-eslint/no-empty-object-type': 'warn',

            // ===== React Hooks =====
            // 'react-hooks/set-state-in-effect': 'off',
        },
    },
])
