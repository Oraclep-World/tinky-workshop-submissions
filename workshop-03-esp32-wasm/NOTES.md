# WS-03 Notes — WASM and the ESP32 module concept

## What I built
Three artifacts that share one intent:

1. **PlatformIO firmware** (`platformio/`) — native ESP32-S3 Arduino build.
2. **ESPHome firmware** (`esphome/`) — same board, declarative YAML config.
3. **WASM module** (`wasm/`) — a tiny portable compute kernel.

## How WASM relates to the ESP32 "module" concept
On an ESP32 you ship a *module* of logic — a self-contained unit of behavior
(e.g. "decide the LED state from a tick counter") compiled down to a binary the
chip runs. WebAssembly is the same idea generalized: `assembly/index.ts` is
compiled to a portable `tinky.wasm` binary that any host can load and run, the
same way the ESP32 runtime loads firmware.

To make the link concrete, the WASM module exports `ledState(tick)` using the
*exact* same blink formula as the C++ firmware:

```
ledState(tick) = (tick / 10) % 2   // on for 10 ticks, off for 10
```

So the blink "module" exists in two compiled forms — `.wasm` (host-portable)
and ESP32 firmware (`.elf`/`.bin`) — proving the logic is toolchain-agnostic.
There are projects (e.g. WAMR — WebAssembly Micro Runtime) that run actual
`.wasm` on ESP32, which is the production version of this same bridge.

## Build environment
Ubuntu Hyper-V VM. No sudo. Toolchains installed isolated via `uv tool`:
- PlatformIO Core 6.1.19
- ESPHome 2026.6.1
- AssemblyScript 0.28.19 (via bun)

## Traps observed / avoided
- **ESPHome + `ψ` unicode in build path** — ESPHome's build dir must be ASCII.
  The submissions repo path is already ASCII; ESPHome compile was additionally
  run under `/tmp/ws03-build/esphome` (ASCII) to keep the generated `.esphome/`
  build tree away from any unicode path. Confirmed safe.
- **Emoji in C source** — kept `main.cpp` ASCII-only; serial prints "Tinky ready"
  (no emoji) to avoid any compiler/encoding surprise.
