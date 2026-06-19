// Tinky WS-03 WASM module (AssemblyScript -> WebAssembly)
// A tiny portable compute kernel. The same kind of pure-math logic
// could be compiled for an ESP32 module; here we target wasm32.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function fib(n: i32): i32 {
  if (n < 2) return n;
  let a: i32 = 0;
  let b: i32 = 1;
  for (let i: i32 = 2; i <= n; i++) {
    const t: i32 = a + b;
    a = b;
    b = t;
  }
  return b;
}

// "blink" model: given a tick counter, decide LED state (1 = on).
// Mirrors the firmware blink logic so WASM and ESP32 share intent.
export function ledState(tick: i32): i32 {
  return (tick / 10) % 2;
}
