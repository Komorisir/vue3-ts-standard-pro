## 1. Token 模块（TDD）

- [x] 1.1 写失败 spec：扩展色板含 host `#ebebeb`、强调 `#ff4d6d`、表面白、Tab 浅灰、主/次/禁用字、边框、成功/警告/错误、hover、overlay 遮罩
- [x] 1.2 写失败 spec：间距只含 4/8/12/16，字号 11/12/13/14，圆角控件 6 / 卡片 8，字体栈含 `PingFang SC` 与 `Microsoft YaHei`
- [x] 1.3 写失败 spec：导出给 ConfigProvider 的映射含 `colorPrimary` = 强调、`fontSize` = 12、`borderRadius` = 6
- [x] 1.4 实现 `chromeTheme` 扩展（CSS 变量字典 + Ant token 对象），直到上述 spec 通过
- [x] 1.5 `pnpm test:run` 覆盖 `chromeTheme.spec.ts` 为绿

## 2. ConfigProvider 与全局样式

- [x] 2.1 `EditorLayout` 注入完整 token、`componentSize: small`、`fontFamily`，并挂上全部 `--chrome-*` CSS 变量
- [x] 2.2 清掉 `src/style.less` 中与浅色壳冲突的 Vite 暗色根样式（`color-scheme` / `prefers-color-scheme` 字色、默认深色 button）；保留 html/body/#app 满高
- [x] 2.3 确认 Pixi init 仍只读 host 浅灰，不把强调色当空舞台背景

## 3. 现有壳收口

- [x] 3.1 顶栏、左 Tab、Layout、侧栏、调整面板去掉裸 hex / 散落 rgb，改读 CSS 变量或 token
- [x] 3.2 改尺寸 / 旋转等漏网 `Input`、`Select` 与根 `small` 对齐；面板间距收到 4/8/12/16
- [x] 3.3 手风琴卡片圆角改为 8；折叠指示改为 IconPark outline（`Right` / `Down`），去掉 `>` / `∨`
- [x] 3.4 不改 `CropOverlay` 手柄像素，不迁裁剪到 Pixi，UI 不 `import 'pixi.js'`

## 4. 文档、队列与验收

- [x] 4.1 `docs/editor/shell.md` 增加指向 `docs/product/ui-spec.md` 的链接，不复制规范全文
- [x] 4.2 在 `feature_list.json` 的 chrome 模块新增 **feat-037**（编辑器 UI 规范与 token 真源），apply 过程中标 in-progress，完成后标 done 并写证据
- [x] 4.3 更新 `progress.md`
- [x] 4.4 运行 `./init.sh` 与 `npx -y @fission-ai/openspec@latest validate add-editor-ui-spec --strict`
- [x] 4.5 手工清单：浅色壳；系统暗色偏好下仍浅底深字；顶栏按钮与改尺寸输入同为 compact；手风琴无字符箭头；切 Tab 仍一块 canvas（清单已写入 `progress.md`；本环境无法打开 `/editor`，待浏览器确认）
