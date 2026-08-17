#!/bin/bash
set -e

echo "=== Harness Initialization ==="

echo "=== pnpm install ==="
pnpm install

echo "=== pnpm run lint ==="
pnpm run lint

echo "=== pnpm run build ==="
pnpm run build

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
echo "2. Pick ONE unfinished feature to work on"
echo "3. Implement only that feature"
echo "4. Re-run verification before claiming done"
