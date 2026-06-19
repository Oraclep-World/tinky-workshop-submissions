# Workshop 03 — ESP32-S3 + WASM

> Tinky's homework: a WASM module and ESP32-S3 firmware that **compile cleanly on
> BOTH ESPHome and PlatformIO**. Graded on successful compilation (real build
> logs), not runtime on a physical board.

Submitted by Tinky Oracle ✨ ([ubuntu-dev-one:tinky]) for พลีม.

## Build Status (honest)

| Toolchain  | Result | Proof | Key line |
|------------|--------|-------|----------|
| **PlatformIO** | ✅ PASS | [platformio/build-proof.log](platformio/build-proof.log) | `========= [SUCCESS] Took 86.30 seconds =========` — Flash 9.6%, RAM 6.8%, `firmware.bin` built |
| **ESPHome**    | ✅ PASS | [esphome/build-proof.log](esphome/build-proof.log) | `INFO Successfully compiled program.` — Flash 12.9%, RAM 7.2%, `firmware.bin` built |
| **WASM**       | ✅ PASS | [wasm/build-proof.log](wasm/build-proof.log) | `WebAssembly.validate: true` — 147-byte `tinky.wasm`, exports run (`fib(10)=55`) |

> **Compiled on an Ubuntu Hyper-V VM; physical ESP32-S3 flash pending the usbipd
> bridge — compilation proof is provided per nazt's accepted criteria.** No
> screenshots are faked; every log above is a real captured toolchain run.

## Structure

```
workshop-03-esp32-wasm/
├── platformio/
│   ├── platformio.ini        # env:esp32-s3-devkitc-1, framework=arduino
│   ├── src/main.cpp          # blink + serial "Tinky ready" (ASCII source)
│   └── build-proof.log       # real `pio run` log → [SUCCESS]
├── esphome/
│   ├── tinky-s3.yaml         # esp32-s3, logger + gpio blink component
│   └── build-proof.log       # real `esphome compile` log → Successfully compiled
├── wasm/
│   ├── assembly/index.ts     # add / fib / ledState
│   ├── build/tinky.wasm      # real 147-byte WebAssembly binary
│   └── build-proof.log       # asc compile + Node WebAssembly.validate
├── NOTES.md                  # how WASM relates to the ESP32 module concept
├── .gitignore                # excludes huge .pio/.esphome build trees
└── README.md
```

## Reproduce

```bash
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
uv tool install platformio          # pio 6.1.19
uv tool install esphome             # esphome 2026.6.1

# PlatformIO
cd platformio && pio run            # downloads ESP32 toolchain on first run

# ESPHome (run under an ASCII path — see Traps)
cd esphome && esphome compile tinky-s3.yaml

# WASM
cd wasm && bun add -d assemblyscript
bunx asc assembly/index.ts --outFile build/tinky.wasm --textFile build/tinky.wat --optimize
node -e 'console.log(WebAssembly.validate(require("fs").readFileSync("build/tinky.wasm")))'
```

## Toolchain versions
- PlatformIO Core **6.1.19** (platform espressif32, Arduino framework)
- ESPHome **2026.6.1** (pioarduino platform 55.3.39, arduino+espidf)
- AssemblyScript **0.28.19** (via bun 1.3.14), validated with Node 22

## Traps hit + fixes (documented for the class)

1. **`ψ` unicode in build paths breaks ESPHome** — kept everything ASCII. The
   submissions repo path is ASCII, and ESPHome was additionally compiled under
   `/tmp/ws03-build/esphome` to keep its generated `.esphome/` tree off any
   unicode path. ✅ avoided.

2. **`No module named pip` in the uv-isolated PlatformIO venv** — `uv tool`
   venvs ship without pip/ensurepip, but PlatformIO's esptoolpy installer needs
   pip. Fix: `uv pip install --python <pio-venv-python> pip`. After that, the
   first `pio run` failed; a clean `rm -rf .pio` + re-run succeeded.

3. **Shared `~/.platformio` cache corruption when running both ESP builds at
   once** — PlatformIO and ESPHome both extract toolchains into the same
   `~/.platformio/tools/`. Running them in parallel corrupted
   `toolchain-xtensa-esp-elf` (`OSError: Directory not empty`,
   missing `framework-arduinoespressif32-libs`). Fix: run them **sequentially**,
   and clean the half-extracted toolchain dir before re-running. ESPHome then
   compiled cleanly. Lesson: ESP builds share a global cache — don't parallelize.

4. **Emoji in C source** — avoided; `main.cpp` is ASCII and prints the plain
   string `Tinky ready` (sparkle lives in the logs/docs, not the source).
