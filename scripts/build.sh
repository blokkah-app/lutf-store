#!/usr/bin/env bash
# Build the paste-ready files for Zid: minified, comment-free, ASCII-only
# (Arabic text is \u-escaped so nothing can be mangled by the dashboard editor).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
npx -y esbuild@0.24.0 src/lutf.css --minify --charset=ascii --outfile=dist/lutf.min.css --log-level=warning
npx -y esbuild@0.24.0 src/lutf.js --minify --charset=ascii --target=es2017 --outfile=dist/lutf.min.js --log-level=warning
LC_ALL=C grep -q '[^ -~]' dist/lutf.min.js dist/lutf.min.css && { echo "non-ASCII found"; exit 1; } || true
wc -c dist/lutf.min.css dist/lutf.min.js
