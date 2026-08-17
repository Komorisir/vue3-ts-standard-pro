# TDD 约定

命令：`pnpm test`（watch） / `pnpm test:run`（CI 与 `./init.sh`）。  
用例与实现同目录，文件名 `*.spec.ts`，显式 `import { describe, expect, it } from 'vitest'`。

## 必须先红后绿

适用于纯逻辑：文档模型、命令栈、数值工具、导出纯函数、可测的 store 变换。

1. **Red**：先写失败 spec，跑 `pnpm test:run` 看到失败
2. **Green**：写最少实现让它通过
3. **Refactor**：在绿的前提下整理，不扩 scope

没有失败用例就写生产代码，不算完成该项逻辑。

## 不要单测的部分

- PixiJS `Application` / WebGL 帧 / GPU 纹理
- 画布命中、手柄拖拽的像素级交互（用手工清单 + 场景记录）
- 第三方组件库内部行为

这些记在 change 的 design / progress 里，作为手工验收。

## 文件与门禁

- 新逻辑放 `src/**`，spec 紧挨着：`foo.ts` + `foo.spec.ts`
- `./init.sh` 必须跑 `pnpm test:run`；失败则整次验证失败
- feat-017 负责补齐编辑器模型 / 命令 / 导出的产品测试，不负责再搭运行器
