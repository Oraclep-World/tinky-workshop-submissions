#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$DIR/start-chain.sh"
sleep 2
bash "$DIR/start-frontend.sh"
bash "$DIR/start-otterscan.sh"
echo ""
echo "=== Tinky Workshop-06 Stack ==="
echo "RPC:       http://141.11.156.4:8547  (chain 20260619)"
echo "Frontend:  http://141.11.156.4:8548"
echo "Otterscan: http://141.11.156.4:8549"
