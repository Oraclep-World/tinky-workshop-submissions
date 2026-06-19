#!/bin/bash
export PATH=$PATH:/home/oracle-school/.foundry/bin
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SESSION="tinky-chain"

pkill -f 'anvil.*8547' 2>/dev/null || true
tmux kill-session -t "$SESSION" 2>/dev/null || true
sleep 1

mkdir -p "$DIR/logs"
tmux new-session -d -s "$SESSION" \
  "anvil --chain-id 20260619 --host 0.0.0.0 --port 8547 --block-time 4 --accounts 10 --init $DIR/genesis.json 2>&1 | tee $DIR/logs/anvil.log"

echo "Tinky chain started on port 8547 (tmux: $SESSION)"
echo "RPC: http://141.11.156.4:8547"
