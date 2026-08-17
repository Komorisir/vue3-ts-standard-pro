#!/bin/bash
set -e

echo "=== Harness Initialization ==="

echo "=== pnpm install ==="
pnpm install

echo "=== pnpm run lint ==="
pnpm run lint

echo "=== pnpm test:run ==="
pnpm test:run

echo "=== pnpm run build ==="
pnpm run build

echo "=== openspec validate ==="
npx -y @fission-ai/openspec@latest validate --all

echo "=== codegraph status ==="
if command -v codegraph >/dev/null 2>&1; then
  codegraph status
else
  echo "codegraph CLI not found; skip graph health check"
fi

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Ensure an OpenSpec change exists (npx @fission-ai/openspec@latest list)"
echo "3. Pick ONE unfinished feature and implement only that change"
echo "4. Re-run verification before claiming done, then archive the change"
