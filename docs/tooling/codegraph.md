# Codegraph Context Snapshot

生成时间：2026-08-17。按需阅读，不要在每轮对话全文粘贴。

刷新命令：

```bash
codegraph status --json
codegraph context "setupStore useGlobalStore createApp HelloWorld" --no-code
```

## Index

- files: 9
- nodes: 53
- edges: 82
- languages: typescript, vue
- kinds: component 2 / constant 8 / enum 1 / file 9 / function 2 / import 29 / interface 1

## Entry Points

| Symbol | Kind | Location |
|---|---|---|
| `setupStore` | function | `src/store/index.ts:12` `(app: App<Element>)` |
| `HelloWorld` | component | `src/components/HelloWorld.vue:1` |
| `useGlobalStore` | store | `src/store/modules/global.ts:9` |

## Related

- `src/App.vue` — `App`
- `src/components/HelloWorld.vue` — `globalStore`
- `src/store/modules/global.ts` — `useGlobalStoreWithout`

## Agent 用法

优先 MCP：`codegraph_context` → 不够再 `codegraph_explore`。改代码后约 500ms 再查。未初始化时执行 `codegraph init -i`。
