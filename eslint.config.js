import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),

    {
        files: ['**/*.{ts,tsx}'],

        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },

        plugins: {
            prettier,
        },

        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...reactHooks.configs.flat.recommended.rules,
            ...reactRefresh.configs.vite.rules,

            // Prettier
            'prettier/prettier': [
                'warn',
                {
                    tabWidth: 4,
                    printWidth: 120,
                    semi: false,
                    singleQuote: true,
                    arrowParens: 'always',
                    plugins: ['prettier-plugin-tailwindcss'],
                },
            ],

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_$',
                    varsIgnorePattern: '^_$',
                    caughtErrorsIgnorePattern: '^_$',
                },
            ],
        },
    },
])
