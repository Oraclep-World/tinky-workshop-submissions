// Tinky WS-03 - ESP32-S3 firmware (PlatformIO / Arduino framework)
// Minimal real firmware: blink on-board LED + serial heartbeat.
// Source kept ASCII-only (no emoji in C/C++ source) to avoid toolchain issues.

#include <Arduino.h>

#ifndef LED_BUILTIN
#define LED_BUILTIN 48  // ESP32-S3-DevKitC-1 onboard RGB LED data pin
#endif

static uint32_t tick = 0;

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println("Tinky ready");  // sparkle in the logs, ASCII in source
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // ledState mirrors the WASM kernel: on for 10 ticks, off for 10.
  int state = (tick / 10) % 2;
  digitalWrite(LED_BUILTIN, state ? HIGH : LOW);
  if (tick % 10 == 0) {
    Serial.print("tick=");
    Serial.print(tick);
    Serial.print(" led=");
    Serial.println(state);
  }
  tick++;
  delay(100);
}
