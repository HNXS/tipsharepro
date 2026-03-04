#!/bin/bash

cleanup() {
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

trap cleanup SIGTERM SIGINT

# Start the backend on port 3001
cd /home/runner/workspace/tip-share-pro-backend
PORT=3001 npx tsx src/index.ts &
BACKEND_PID=$!

# Start the Next.js frontend on port 5000
cd /home/runner/workspace/tip-share-pro-app
PORT=5000 BACKEND_INTERNAL_URL=http://localhost:3001 npx next dev -p 5000 &
FRONTEND_PID=$!

# Keep script alive
while kill -0 $FRONTEND_PID 2>/dev/null; do
  sleep 2
done
