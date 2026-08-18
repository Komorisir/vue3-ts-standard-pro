# 25–27 性能 · 异常 · 测试

## 25 性能优化

图片编辑器最大风险之一是 GPU 纹理与主线程解码。PixiJS 官方态度：先 profile 再优化；默认就能撑住中等场景。

### 25.1 指标（内部试用）

| 场景 | 目标 |
|---|---|
| 空编辑器 / 一张 4K 图平移缩放 | 交互 ≥ 50 FPS，滚轮无掉帧感 |
| 20 层以内、无滤镜 | ≥ 50 FPS |
| 拖变换手柄 | pointermove 不卡死；松手立刻稳定 |
| 反复进出 `/editor` 10 次 | 无第二块 canvas；DevTools Memory 不单调涨 |
| 导出 4K PNG | 成功或明确失败，不白屏 |

压测图：8K JPEG、20 张 2K 叠加、单层 + ColorMatrix + Blur。

### 25.2 图片

| 点 | 策略 |
|---|---|
| 解码 | `Assets.load`；超大 File 主线程会卡，P1 加尺寸/体积上限 |
| Texture | 一层一纹理；删层 `destroy({ texture, textureSource })` + `Assets.unload` |
| objectURL | 【建议优化】revoke 与 History 栈联动，勿在 undo 前revoke |
| ImageBitmap | 【后续演进】大图解码进 worker |
| 缓存 | 同一 URL 不重复 load |

### 25.3 Canvas / 分辨率

【保持】`autoDensity` + `resolution: devicePixelRatio` + `resizeTo: host`。视口缩放改 Container，不改 renderer 分辨率。导出用文档像素，不把 DPR 误乘两次。

### 25.4 GPU

- 滤镜：`filterArea`；不用则 `filters = null`
- Mask：矩形优先；少用 Sprite mask
- 批处理：同类对象相邻（sprite 连在一起）
- `cullable`：GPU bound 时对大图开启；CPU bound 时不要（官方：cull 有 CPU 成本）
- `gcMaxUnusedTime` / `gcFrequency` 按需调；destroy 必须 `releaseGlobalResources: true`

### 25.5 导出

RenderTexture 尺寸 ≤ `MAX_TEXTURE_SIZE`。超限降 scale。不要同时保留多张全尺寸 RT。

### 25.6 交互

`pointermove` 只更新数字；Graphics 手柄可每帧重画但不要 alloc 纹理。滑条 debounce。`interactiveChildren = false` 加在无交互容器。

### 25.7 与 feat-016

P0 生命周期已 destroy。feat-016：删层释纹理、culling、进出无泄漏。不要提前做对象池。

---

## 26 异常处理

| 场景 | 行为 |
|---|---|
| 非图片 / 空 File / 解码失败 | 可见错误；文档不变；finally revoke |
| 超 MAX_TEXTURE_SIZE | 提示缩小；不写坏层 |
| `init()` 未完成 | 不读 canvas/renderer/screen |
| 重复进页 | 不得第二块 canvas |
| sync 单层失败 | 跳过该 id，其余继续；禁止空 catch |
| GPU 上下文丢失 | 提示刷新；不抛到页外 |
| 导出失败 | 恢复 overlay.visible |
| NaN 变换 | 入口拒绝 |
| 快捷键在 input 内 | 不处理 |

ticker / 指针回调必须自己 catch，未捕获异常不得撕掉整页。

---

## 27 测试体系

| 类型 | 范围 | 命令 |
|---|---|---|
| 单元 | model、viewportMath、command、crop、export 纯函数、store 变换 | `pnpm test:run`；先红后绿 |
| 禁止单测 | Application 帧、GPU 纹理、像素级命中 | 手工清单写在 change design |
| 边界 | 空文档、锁定、坏文件、0 尺寸 host | spec + 手工 |
| 性能 | 进出页、大图、滤镜拖滑条 | 手工 + 可选 Performance panel |
| 导出一致 | 有滤镜/裁剪/文字；无选框 | 手工对比 |
| 门禁 | lint、vue-tsc、test、openspec、codegraph | `./init.sh` |

feat-017：补命令栈、排序、裁剪矩形、导出 helper，不负责再搭运行器。
