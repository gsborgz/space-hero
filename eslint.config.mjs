import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  {
    ignores: ['**/*.spec.ts'],
    plugins: {
      'unused-imports': unusedImports,
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': ['error', {}],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true
          }
        }
      ],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-loss-of-precision': 'off',
      indent: 'off',
      '@typescript-eslint/no-var-requires': 0,
      'no-restricted-imports': ['error', {
        patterns: ['.*']
      }],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1, ignoredNodes: [
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
      ]}],
      'padded-blocks': ['error', { blocks: 'never', switches: 'never', classes: 'always' }],
      'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'}, 
        { blankLine: 'never',  prev: ['const', 'let', 'var'], next: ['const', 'let', 'var']},
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['if', 'for', 'while', 'do'] },
        { blankLine: 'always', prev: ['if', 'for', 'while', 'do'], next: '*' }
      ],
      'max-lines-per-function': ['error', {
        max: 400
      }],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-case-declarations': 'off',
      'no-loss-of-precision': 'off',
    }
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    }
  }
);
