#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  getOfflineFallbackMessage,
  resolveInitialMapState,
} from "../src/components/map/map-runtime-state.ts";

assert.deepEqual(
  resolveInitialMapState({
    forceOffline: true,
    hasMapboxToken: true,
  }),
  {
    kind: "offline-fallback",
    reason: "forced-offline",
  },
);

assert.deepEqual(
  resolveInitialMapState({
    forceOffline: false,
    hasMapboxToken: false,
  }),
  {
    kind: "offline-fallback",
    reason: "missing-token",
  },
);

assert.deepEqual(
  resolveInitialMapState({
    forceOffline: false,
    hasMapboxToken: true,
  }),
  { kind: "loading" },
);

for (const reason of [
  "forced-offline",
  "missing-token",
  "webgl-unavailable",
]) {
  assert.ok(
    getOfflineFallbackMessage(reason).length > 0,
    `${reason} must have reader-facing fallback copy`,
  );
}

console.log("P4 map runtime states valid: forced, missing-token, WebGL, online");
