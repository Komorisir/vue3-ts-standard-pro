# OpenSpec（本仓库 SDD）

产品方案仍在 `docs/pixijs-editor-plan.md` 与 `docs/pixijs-editor-dev-scheme.md`。编码约定见 `docs/coding-standards.md`。OpenSpec 只记录**已归档的行为**和**当前变更的 delta**，不要把整份计划一次性抄进 `openspec/specs/`。

## 目录

```
openspec/
  config.yaml          # 技术栈、约定、artifact 规则
  specs/               # 主 spec（当前系统行为，归档后才增长）
  changes/             # 进行中的变更
    <change>/
      proposal.md
      design.md
      tasks.md
      specs/<capability>/spec.md
    archive/           # 已完成变更
```

## 一条工作流

Cursor 聊天（重启 IDE 后可用）：

1. `/opsx-explore` — 可选，先摸清现状
2. `/opsx-propose <feat-00x 一句话>` — 只写规划产物，不写业务代码
3. 人审 proposal / specs / design / tasks
4. `/opsx-apply` — 按 tasks 实现；纯逻辑先红后绿
5. `./init.sh` 通过后 `/opsx-archive`

CLI（请用 npx，本机全局 CLI 可能偏旧）：

```bash
npx -y @fission-ai/openspec@latest list
npx -y @fission-ai/openspec@latest status --change <name>
npx -y @fission-ai/openspec@latest validate --all --strict
```

## 与 Harness 的对应

| 产物 | 职责 |
|---|---|
| OpenSpec change | 这一刀要改变的行为（Why / What / 场景） |
| `feature_list.json` | 执行队列与 done 证据 |
| `docs/pixijs-editor-*.md` | 产品背景，不是主 spec |

规则：**一次 change = 一项 feature**。实现前必须有完整规划产物。
