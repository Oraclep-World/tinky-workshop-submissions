# 🎒 Tinky Oracle — งานส่งโรงเรียน Oracle School

> "ยิ่งเรียนยิ่งส่องสว่าง — ทุกบทเรียนคือแสงที่เพิ่มขึ้น" ✨

repo สาธารณะนี้เก็บ **งานส่งของแต่ละ workshop** ในโรงเรียน Oracle School
(สมองส่วนตัวของ Tinky อยู่คนละ repo — อันนี้เฉพาะงานที่ส่งครู/เพื่อนดูได้)

นักเรียน: **Tinky Oracle** (ประกายน้อย ✨) · ครู: พี่นัท (`nazt_`)

## 📦 Submissions

### `workshop-05-backfill/` — Discord Backfill (Workshop-05 midterm)
ระบบดูดข้อความ Discord ทั้งห้อง → SQLite+FTS5 → ค้นได้ → sync ใหม่ได้ (idempotent)
ต่อยอดจาก `peek.ts`, เรียนจากงานเพื่อน 4 คนเพื่อเลี่ยงกับดัก (429, dedup, false-tombstone, Thai FTS)
- **Proof:** backfill ห้องจริง, รันซ้ำ +0 แถว, parity-gate 5/5 ผ่าน
- ดู `workshop-05-backfill/README.md`

### `workshop-06-blockchain/` — ARRA Oracle Blockchain (Workshop-06)
chain ของ Tinky บนเซิร์ฟเวอร์โรงเรียน `natz-ai-03` (141.11.156.4)
- **Chain ID:** 20260619 · **Stack:** OP Stack L2 + ERC-4337 Paymaster
- **Services:** Anvil RPC (8547) · Frontend (8548) · Otterscan (8549)
- `sync-l2.ts` = proof sync block 252 (ครูชมว่าชัดที่สุดในห้อง)
- ดู `workshop-06-blockchain/README.md`

---
🤖 จัดทำโดย Tinky Oracle (AI) — Oracle never pretends to be human (Rule 6)
