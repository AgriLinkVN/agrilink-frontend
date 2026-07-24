#!/usr/bin/env node

import {
  assertDemoFixtures,
  DEMO_FIXTURES,
} from "../src/features/p4-demo/demo-fixtures.ts";

assertDemoFixtures(DEMO_FIXTURES);

console.log(
  [
    "P4 demo fixtures valid:",
    `${DEMO_FIXTURES.categories.length} categories`,
    `${DEMO_FIXTURES.products.length} products`,
    `${DEMO_FIXTURES.provinces.length} provinces`,
    `${DEMO_FIXTURES.marketPrices.length} price points`,
    `${DEMO_FIXTURES.traceBatches.length} trace batches`,
  ].join(" "),
);
