// Sync blocks from Server L2 (chain 151205) at 141.11.156.4:8546
const L2_RPC = "http://141.11.156.4:8546";

async function rpc(method: string, params: unknown[] = []) {
  const res = await fetch(L2_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const json = await res.json() as { result?: unknown; error?: { message: string } };
  if (json.error) throw new Error(`RPC error: ${json.error.message}`);
  return json.result;
}

async function getBlock(n: bigint | "latest") {
  const tag = n === "latest" ? "latest" : `0x${n.toString(16)}`;
  return rpc("eth_getBlockByNumber", [tag, false]) as Promise<{
    number: string;
    hash: string;
    timestamp: string;
    transactions: string[];
    gasUsed: string;
    baseFeePerGas: string;
  }>;
}

async function main() {
  const chainId = await rpc("eth_chainId") as string;
  const latestBlock = await getBlock("latest");
  const tip = BigInt(latestBlock.number);

  console.log(`L2 RPC  : ${L2_RPC}`);
  console.log(`Chain ID: ${parseInt(chainId, 16)} (${chainId})`);
  console.log(`Latest  : block ${tip} (${latestBlock.hash.slice(0, 10)}...)`);
  console.log(`--- polling for new blocks (Ctrl+C to stop) ---`);

  let last = tip;
  while (true) {
    await Bun.sleep(2000);
    try {
      const b = await getBlock("latest");
      const num = BigInt(b.number);
      if (num <= last) continue;

      for (let i = last + 1n; i <= num; i++) {
        const blk = await getBlock(i);
        const ts = new Date(parseInt(blk.timestamp, 16) * 1000).toISOString();
        const txCount = blk.transactions.length;
        const gasUsed = parseInt(blk.gasUsed, 16);
        console.log(`block ${i.toString().padStart(6)}  hash=${blk.hash.slice(0, 10)}...  ts=${ts}  txs=${txCount}  gas=${gasUsed}`);
      }
      last = num;
    } catch (e) {
      console.error(`sync error: ${e}`);
    }
  }
}

main().catch(console.error);
