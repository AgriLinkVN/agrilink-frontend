/**
 * Explicit mapping giữa tên tỉnh (trong GeoJSON) ↔ mã tỉnh (34 tỉnh sau sáp nhập).
 * Source: Nghị quyết 202/2025/QH15 + bandonongsanviet.vn vietnam.geojson
 * Validated: 34/34, 2026-05-31
 */

export const PROVINCE_NAME_TO_CODE: Record<string, string> = {
  "An Giang": "91",
  "Bắc Ninh": "24",
  "Cà Mau": "96",
  "Cần Thơ": "92",
  "Cao Bằng": "04",
  "Đà Nẵng": "48",
  "Đắk Lắk": "66",
  "Điện Biên": "11",
  "Đồng Nai": "75",
  "Đồng Tháp": "82",
  "Gia Lai": "52",
  "Hà Nội": "01",
  "Hà Tĩnh": "42",
  "Hải Phòng": "31",
  "Huế": "46",
  "Hưng Yên": "33",
  "Khánh Hòa": "56",
  "Lai Châu": "12",
  "Lâm Đồng": "68",
  "Lạng Sơn": "20",
  "Lào Cai": "15",
  "Nghệ An": "40",
  "Ninh Bình": "37",
  "Phú Thọ": "25",
  "Quảng Ngãi": "51",
  "Quảng Ninh": "22",
  "Quảng Trị": "44",
  "Sơn La": "14",
  "Tây Ninh": "80",
  "Thái Nguyên": "19",
  "Thanh Hóa": "38",
  "TP. Hồ Chí Minh": "79",
  "Tuyên Quang": "08",
  "Vĩnh Long": "86",
} as const;

/** Reverse: mã tỉnh → tên tỉnh (tiếng Việt trong GeoJSON) */
export const PROVINCE_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(PROVINCE_NAME_TO_CODE).map(([name, code]) => [code, name])
);

/** Vùng miền theo mã tỉnh */
export type Region = "North" | "Central" | "Highlands" | "South";

export const PROVINCE_REGION: Record<string, Region> = {
  "01": "North",   // Hà Nội
  "04": "North",   // Cao Bằng
  "08": "North",   // Tuyên Quang
  "11": "North",   // Điện Biên
  "12": "North",   // Lai Châu
  "14": "North",   // Sơn La
  "15": "North",   // Lào Cai
  "19": "North",   // Thái Nguyên
  "20": "North",   // Lạng Sơn
  "22": "North",   // Quảng Ninh
  "24": "North",   // Bắc Ninh
  "25": "North",   // Phú Thọ
  "31": "North",   // Hải Phòng
  "33": "North",   // Hưng Yên
  "37": "North",   // Ninh Bình
  "38": "Central", // Thanh Hóa
  "40": "Central", // Nghệ An
  "42": "Central", // Hà Tĩnh
  "44": "Central", // Quảng Trị
  "46": "Central", // Huế
  "48": "Central", // Đà Nẵng
  "51": "Central", // Quảng Ngãi
  "56": "Central", // Khánh Hòa
  "52": "Highlands", // Gia Lai
  "66": "Highlands", // Đắk Lắk
  "68": "Highlands", // Lâm Đồng
  "75": "South",   // Đồng Nai
  "79": "South",   // TP.HCM
  "80": "South",   // Tây Ninh
  "82": "South",   // Đồng Tháp
  "86": "South",   // Vĩnh Long
  "91": "South",   // An Giang
  "92": "South",   // Cần Thơ
  "96": "South",   // Cà Mau
};

/** Region color mapping cho choropleth — dùng AgriLink palette */
export const REGION_FILL_COLORS: Record<Region, string> = {
  North: "#2D6A4F",      // Forest Green
  Central: "#2563EB",    // Blue
  Highlands: "#92400E",  // Brown
  South: "#F4A261",      // Clay Orange
};

export const REGION_LABELS_VI: Record<Region, string> = {
  North: "Miền Bắc",
  Central: "Miền Trung",
  Highlands: "Tây Nguyên",
  South: "Miền Nam",
};
