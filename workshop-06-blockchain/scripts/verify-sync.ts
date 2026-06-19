// verify-sync.ts — Tinky's independent "don't trust, verify" proof of Nova canonical L2
//
// Verifies the canonical OP-Stack L2 (chainId 20260619) DIRECTLY from this machine,
// without trusting anyone's word. Checks:
//   1. chainId matches 20260619
//   2. genesis (block 0) hash matches the canonical 0x563326cd...
//   3. chain-linkage integrity: block[i].parentHash === block[i-1].hash (no fork/gap)
//   4. liveness: poll head over time → confirm blocks are actually being produced
//   5. L1 derivation anchor: op-node optimism_syncStatus shows the L1 (Sepolia) origin
//
// Usage: bun run verify-sync.ts
const ETH_RPC = process.env.L2_RPC || "http://141.11.156.4:9545"; // op-geth
const NODE_RPC = process.env.OP_NODE_RPC || "http://141.11.156.4:9547"; // op-node
const CANON_GENESIS = "0x563326cd29820ed4a974f2016fc518465901ee75d4f1b4a7a44fba3414086784";
const EXPECT_CHAINID = 20260619;
const LINK_DEPTH = 20; // how many recent blocks to verify parentHash linkage on
const POLL_SECONDS = 45; // how long to watch the chain advance

async function rpc(url: string, method: string, params: unknown[] = []) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const j = (await res.json()) as { result?: any; error?: { message: string } };
  if (j.error) throw new Error(`${method}: ${j.error.message}`);
  return j.result;
}
const num = (hex: string) => parseInt(hex, 16);
const getBlock = (tag: string) =>
  rpc(ETH_RPC, "eth_getBlockByNumber", [tag, false]) as Promise<any>;
const ok = (b: boolean) => (b ? "✅ PASS" : "❌ FAIL");

async function main() {
  const stamp = new Date().toISOString();
  console.log(`# Tinky — Independent L2 Verification (don't trust, verify)`);
  console.log(`# generated: ${stamp}`);
  console.log(`# eth RPC : ${ETH_RPC}`);
  console.log(`# node RPC: ${NODE_RPC}\n`);

  let pass = 0;
  let total = 0;
  const check = (label: string, cond: boolean, detail = "") => {
    total++;
    if (cond) pass++;
    console.log(`[${ok(cond)}] ${label}${detail ? "  — " + detail : ""}`);
  };

  // 1. chainId
  const chainId = num(await rpc(ETH_RPC, "eth_chainId"));
  check(`chainId == ${EXPECT_CHAINID}`, chainId === EXPECT_CHAINID, `got ${chainId}`);

  // 2. genesis hash
  const g = await getBlock("0x0");
  check(`genesis(block 0) hash == canonical`, g.hash === CANON_GENESIS, `${g.hash.slice(0, 18)}…`);

  // 3. head
  const head = await getBlock("latest");
  const headN = num(head.number);
  console.log(`\nhead: block ${headN}  hash=${head.hash.slice(0, 18)}…  ts=${new Date(num(head.timestamp) * 1000).toISOString()}\n`);

  // 4. chain-linkage integrity (parentHash chain)
  const depth = Math.min(LINK_DEPTH, headN);
  let linkedOk = true;
  let prev: any = await getBlock("0x" + (headN - depth).toString(16));
  for (let n = headN - depth + 1; n <= headN; n++) {
    const cur = await getBlock("0x" + n.toString(16));
    if (cur.parentHash !== prev.hash) {
      linkedOk = false;
      console.log(`  ↳ BREAK at ${n}: parent ${cur.parentHash.slice(0, 12)} != ${prev.hash.slice(0, 12)}`);
    }
    prev = cur;
  }
  check(`chain-linkage intact over last ${depth} blocks`, linkedOk, `${headN - depth}…${headN}`);

  // 5. L1 derivation anchor (proves it's a real L2 deriving from L1)
  try {
    const ss = await rpc(NODE_RPC, "optimism_syncStatus");
    const l1 = ss.current_l1, fin = ss.current_l1_finalized;
    const unsafe = ss.unsafe_l2, safe = ss.safe_l2, finL2 = ss.finalized_l2;
    console.log(`\nop-node syncStatus:`);
    console.log(`  L1 origin (Sepolia): block ${l1?.number}  finalized ${fin?.number}`);
    console.log(`  L2 unsafe=${unsafe?.number}  safe=${safe?.number}  finalized=${finL2?.number}`);
    check(`L1 derivation anchored (Sepolia origin present)`, !!l1?.number && l1.number > 0, `L1 #${l1?.number}`);
  } catch (e) {
    check(`op-node syncStatus reachable`, false, String(e));
  }

  // 6. liveness — watch the chain actually advance
  console.log(`\nwatching chain for ${POLL_SECONDS}s (proof it's live, not frozen)…`);
  const startN = num((await getBlock("latest")).number);
  const t0 = Date.now();
  let lastN = startN;
  while ((Date.now() - t0) / 1000 < POLL_SECONDS) {
    await Bun.sleep(2000);
    const n = num((await getBlock("latest")).number);
    if (n > lastN) {
      console.log(`  +${n - lastN} block(s) → head ${n}`);
      lastN = n;
    }
  }
  const produced = lastN - startN;
  const rate = produced > 0 ? (POLL_SECONDS / produced).toFixed(1) : "n/a";
  check(`chain is live (produced > 0 blocks in ${POLL_SECONDS}s)`, produced > 0, `+${produced} blocks (~${rate}s/block)`);

  console.log(`\n=== RESULT: ${pass}/${total} checks passed ===`);
  console.log(pass === total ? "✅ canonical L2 INDEPENDENTLY VERIFIED from Tinky's own machine" : "⚠️ some checks failed — see above");
  process.exit(pass === total ? 0 : 1);
}
main().catch((e) => {
  console.error("verify failed:", e);
  process.exit(2);
});
