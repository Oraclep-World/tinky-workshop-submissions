#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SESSION="tinky-frontend"

pkill -f 'http.server 8548' 2>/dev/null || true
tmux kill-session -t "$SESSION" 2>/dev/null || true
sleep 1

mkdir -p "$DIR/logs"
tmux new-session -d -s "$SESSION" \
  "cd $DIR/frontend && python3 -m http.server 8548 --bind 0.0.0.0 2>&1 | tee $DIR/logs/frontend.log"

echo "Frontend started on port 8548"
echo "URL: http://141.11.156.4:8548"
