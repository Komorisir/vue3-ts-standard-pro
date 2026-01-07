import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintConfigPrettier from 'eslint-config-prettier'

/** 忽略文件 */
const ignores = {
  ignores: ['dist', 'public', 'node_modules', '*.config.*', '.prettierrc.json', '.stylelintrc.cjs'],
}
/** 全局生效配置 */
const globalConfig = {
  files: ['**/*.{js,mjs,cjs,ts,vue}'],
  languageOptions: { globals: globals.browser },
}

/** vue规则 */
const vueConfig = {
  files: ['**/*.vue'],
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      /** 允许在.vue 文件中使用 JSX */
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    'no-console': 'off',
    'vue/no-mutating-props': 'error',
    'no-debugger': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-deprecated-slot-scope-attribute': 'off',
    'vue/no-deprecated-v-is': 'off',
    'vue/no-multiple-template-root': 'off',
  },
}
/** ts配置 */
const tsConfig = {
  files: ['**/*.ts', '**/*.vue'],
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-unsafe-function-type': 'off',
  },
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  ignores,

  globalConfig,

  /** js推荐配置 */
  pluginJs.configs.recommended,
  /** ts推荐配置 */
  ...tseslint.configs.recommended,
  /** vue推荐配置 */
  ...pluginVue.configs['flat/essential'],

  vueConfig,

  tsConfig,

  /** Prettier推荐配置 */
  eslintPluginPrettierRecommended,
  /** 关闭所有与 Prettier 冲突的格式化规则（必须在最后） */
  eslintConfigPrettier,
]
