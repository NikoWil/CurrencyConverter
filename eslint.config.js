import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.strict, // or .recommended / strictTypeChecked
    eslintConfigPrettier,
    {
        rules: {
            // own overrides
        }
    }
);
