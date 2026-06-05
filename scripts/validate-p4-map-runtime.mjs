#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  getMapUnavailableMessage,
  resolveInitialMapState,
} from "../src/components/map/map-runtime-state.ts";

assert.deepEqual(
  resolveInitialMapState({
    hasMapboxToken: false,
  }),
  {
    kind: "unavailable",
    reason: "missing-token",
  },
);

assert.deepEqual(
  resolveInitialMapState({
    hasMapboxToken: true,
  }),
  { kind: "loading" },
);

for (const reason of ["missing-token", "webgl-unavailable"]) {
  assert.ok(
    getMapUnavailableMessage(reason).length > 0,
    `${reason} must have reader-facing unavailable copy`,
  );
}

console.log("P4 map runtime states valid: missing-token, WebGL, online");
