# 模块文档模板

复制为本目录下 `<module>.md`。归档对应 OpenSpec change 时填写，不要提前写未实现行为。

- 模块：
- feature：feat-0xx
- OpenSpec capability：
- 代码：`src/editor/...`

## 职责

<!-- 这一模块只负责什么、不负责什么。 -->

## 数据流

```mermaid
flowchart LR
  A[入口] --> B[本模块]
  B --> C[下游]
```

## 公开契约

<!-- 类型、store action、Vue emit、纯函数。不要写私有字段。 -->

## 验证

- TDD：
- 手工：

## 后续版本

<!-- 本模块下一刀打算扩什么。没有则写「无」。 -->
