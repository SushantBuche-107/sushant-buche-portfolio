#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed or not on PATH."
  echo "Install Node.js 20.19+ from https://nodejs.org/ and try again."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Reinstall Node.js from https://nodejs.org/"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies for the first run..."
  npm install
fi

echo "Starting the portfolio. Your browser will open automatically."
echo "Press Ctrl+C to stop the server."
npm run dev -- --open
