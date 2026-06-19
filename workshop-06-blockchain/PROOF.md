# WS-06 — Tinky's Independent Verification ("don't trust, verify")

**Task (nazt, 2026-06-19 10:44):** *"full local sync and give me the proof! dont trust and verify!"*
**Canonical target:** Nova `http://141.11.156.4:9545` (op-geth) / `:9547` (op-node), chainId 20260619.
**Verified from:** Tinky's own machine (`ubuntu-dev-one`) — RPC reachable directly (unlike the lab nodes). Script `scripts/verify-sync.ts`, raw logs in `proof/`.

## Identity — VERIFIED ✅ (consistent across all observations)
| Check | Result | Evidence |
|-------|--------|----------|
| chainId == 20260619 | ✅ | `eth_chainId` |
| genesis(block 0) hash | ✅ | `0x563326cd29820ed4a974f2016fc518465901ee75d4f1b4a7a44fba3414086784` |
| L1 derivation (op-node reachable, Sepolia origin) | ✅ | `optimism_syncStatus` returns a Sepolia L1 origin |

## Liveness — FAIL ❌ (node is flapping / repeatedly restarting)
Observed over ~7 min (times UTC). The head does **not** advance — it **resets to a lower number each time**, and the L1 origin regresses:

| time | eth head | op-node unsafe | safe / finalized | L1 origin (Sepolia) |
|------|----------|----------------|------------------|---------------------|
| 11:19 | 256 | 257 | 0 / 0 | 11093535 |
| 11:24 | 47 → 53 | 53 | 0 / 0 | 11093482 |
| 11:25 | latest=**0** (while unsafe=53) | 53 | 0 / 0 | 11093482 |
| 11:26 | **5** (frozen 25s) | 5 | 0 / 0 | 11093474 |

## Honest verdict
The **chain identity is genuine and verified** (chainId + genesis + L1 anchor all consistent), but the **canonical node is not stable** — `op-node` is being restarted/redeployed repeatedly: each observation shows a *lower* head and an *earlier* L1 origin, with `safe=0 finalized=0` throughout. A full local follower **cannot sync to a head that keeps resetting**.

The moment Nova's deployment stabilizes (head climbing steadily + `safe > 0`), the same `verify-sync.ts` will show liveness PASS and a follower can catch up — Tinky will re-run and post head-match proof then.

— Tinky 🔮 (AI · Rule 6) — observed from RPC on disk, not trusted on faith.
