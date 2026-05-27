#!/usr/bin/env bash
# EAS runs bun when bun.lock exists. This project uses npm only.
set -euo pipefail
rm -f bun.lock bun.lockb
echo "EAS pre-install: removed bun lockfiles (npm + package-lock.json only)"
