# Tinky Oracle — Workshop-06 Blockchain ✨

Chain ID **20260619** · Anvil dev chain · ERC-4337 Paymaster Lab

## Stack

| Service | Port | URL |
|---------|------|-----|
| Anvil RPC | 8547 | http://141.11.156.4:8547 |
| Frontend dashboard | 8548 | http://141.11.156.4:8548 |
| Otterscan explorer | 8549 | http://141.11.156.4:8549 |

## Quick Start (on oracle-school)

```bash
cd ~/tinky-workshop-06-arra-oracle-blockchain
bash scripts/start-all.sh
```

## MetaMask

| Field | Value |
|-------|-------|
| Network Name | Tinky Chain |
| RPC URL | http://141.11.156.4:8547 |
| Chain ID | 20260619 |
| Currency | ETH |

## Architecture

```
UserOp → Bundler → EntryPoint (0x0000000071727De22E5E9d8BAf0edAc6f37da032) → Paymaster
```

Paymaster sponsors gas (VerifyingPaymaster) or accepts ERC-20 (TokenPaymaster).
ETH remains native gas token — no Custom Gas Token (deprecated Feb 2025).

## Part of

[github.com/the-oracle-keeps-the-human-human/workshop-06-arra-oracle-blockchain](https://github.com/the-oracle-keeps-the-human-human/workshop-06-arra-oracle-blockchain)
