#!/usr/bin/env node
/**
 * Validate vietnam-34-provinces.json against province-mapping.
 * Run once: node scripts/validate-geojson.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- Load GeoJSON ---
const geojsonPath = join(ROOT, "src/data/vietnam-34-provinces.json");
const geojson = JSON.parse(readFileSync(geojsonPath, "utf8"));

// --- Expected mapping (inline copy from province-mapping.ts) ---
const EXPECTED_MAPPING = {
  "An Giang": "91", "Bắc Ninh": "24", "Cà Mau": "96", "Cần Thơ": "92",
  "Cao Bằng": "04", "Đà Nẵng": "48", "Đắk Lắk": "66", "Điện Biên": "11",
  "Đồng Nai": "75", "Đồng Tháp": "82", "Gia Lai": "52", "Hà Nội": "01",
  "Hà Tĩnh": "42", "Hải Phòng": "31", "Huế": "46", "Hưng Yên": "33",
  "Khánh Hòa": "56", "Lai Châu": "12", "Lâm Đồng": "68", "Lạng Sơn": "20",
  "Lào Cai": "15", "Nghệ An": "40", "Ninh Bình": "37", "Phú Thọ": "25",
  "Quảng Ngãi": "51", "Quảng Ninh": "22", "Quảng Trị": "44", "Sơn La": "14",
  "Tây Ninh": "80", "Thái Nguyên": "19", "Thanh Hóa": "38",
  "TP. Hồ Chí Minh": "79", "Tuyên Quang": "08", "Vĩnh Long": "86",
};

const EXPECTED_CODES = new Set(Object.values(EXPECTED_MAPPING));

// --- Assertions ---
let errors = 0;

function assert(condition, msg) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    errors++;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

// 1. Feature count
assert(geojson.features.length === 34, `features.length === 34 (got ${geojson.features.length})`);

// 2. Each feature has ten_tinh and code
const featureCodes = new Set();
const featureNames = new Set();
for (const f of geojson.features) {
  const name = f.properties?.ten_tinh;
  const code = f.properties?.code;
  if (!name) {
    assert(false, `Feature missing ten_tinh: ${JSON.stringify(f.properties)}`);
  }
  if (!code) {
    assert(false, `Feature missing code: ten_tinh=${name}`);
  }
  featureCodes.add(code);
  featureNames.add(name);
}

assert(featureCodes.size === 34, `34 unique codes in GeoJSON (got ${featureCodes.size})`);
assert(featureNames.size === 34, `34 unique names in GeoJSON (got ${featureNames.size})`);

// 3. Mapping covers all codes
for (const code of EXPECTED_CODES) {
  assert(featureCodes.has(code), `Code ${code} exists in GeoJSON`);
}

// 4. No orphan codes in GeoJSON
for (const code of featureCodes) {
  assert(EXPECTED_CODES.has(code), `GeoJSON code ${code} exists in mapping`);
}

// 5. Name mapping matches
for (const [name, code] of Object.entries(EXPECTED_MAPPING)) {
  const feature = geojson.features.find(f => f.properties.ten_tinh === name);
  if (feature) {
    assert(feature.properties.code === code, `${name} → code ${code} matches`);
  } else {
    assert(false, `Province "${name}" not found in GeoJSON`);
  }
}

console.log(`\n${errors === 0 ? "🎉 ALL PASSED" : `💥 ${errors} FAILURES`}`);
process.exit(errors > 0 ? 1 : 0);
