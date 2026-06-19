#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SESSION="tinky-otterscan"

pkill -f 'http.server 8549' 2>/dev/null || true
tmux kill-session -t "$SESSION" 2>/dev/null || true
sleep 1

OTTERSCAN_DIR="/home/oracle-school/tinky-otterscan"

if [ ! -d "$OTTERSCAN_DIR" ]; then
  echo "Setting up Otterscan static files..."
  cp -r /home/oracle-school/mac1-otterscan "$OTTERSCAN_DIR"
  cat > "$OTTERSCAN_DIR/config.json" <<'EOF'
{
  "erigonRpc": "http://141.11.156.4:8547"
}
EOF
  echo "Otterscan configured to point at Tinky RPC (8547)"
fi

mkdir -p "$DIR/logs"
tmux new-session -d -s "$SESSION" \
  "python3 -m http.server 8549 --directory $OTTERSCAN_DIR --bind 0.0.0.0 2>&1 | tee $DIR/logs/otterscan.log"

echo "Otterscan started on port 8549"
echo "URL: http://141.11.156.4:8549"
