/** 规则文档：https://stylelint.docschina.org/user-guide/rules */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-less',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order',
  ],
  rules: {
    'selector-class-pattern': null,
    'selector-id-pattern': '^[a-z]([a-z0-9-]+[a-z0-9])?$', // ID 选择器必须遵循特定模式（小写字母和连字符）
    'import-notation': 'string', // 指定导入CSS文件的方式("string"|"url")
    'custom-property-pattern': null, // 自定义属性命名规则
    'keyframes-name-pattern': null, // 动画帧节点样式命名规则
    // 不允许使用white、black、red等颜色
    'color-named': 'never',
    // 允许未知属性
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [],
      },
    ],
    'declaration-no-important': true, // 不允许使用 `!important`
    // 允许未知规则
    'at-rule-no-unknown': null,
    'function-no-unknown': null,
    'no-empty-source': null,
  },
}
