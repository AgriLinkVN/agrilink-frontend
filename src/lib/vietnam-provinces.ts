<<<<<<< Updated upstream
=======
<<<<<<< HEAD
export type VietnamProvince = {
  code: string;
  name: string;
  region: "North" | "Central" | "Highlands" | "South";
=======
>>>>>>> Stashed changes
import { PROVINCE_REGION, REGION_LABELS_VI, type Region } from "@/data/province-mapping";

export type VietnamProvince = {
  code: string;
  name: string;
  nameVi: string;
  region: Region;
  regionVi: string;
  slug: string;
  sapNhap: string;
<<<<<<< Updated upstream
=======
>>>>>>> 6fd922c3aa8d363c16bbb45a45ef27094466bd7d
>>>>>>> Stashed changes
  lat: number;
  lng: number;
  products: string[];
  farmingTypes: string[];
  activeFarms: number;
  avgPrice: number;
<<<<<<< Updated upstream
  danSo?: number;
  dienTich?: number;
=======
<<<<<<< HEAD
=======
  danSo?: number;
  dienTich?: number;
>>>>>>> 6fd922c3aa8d363c16bbb45a45ef27094466bd7d
>>>>>>> Stashed changes
};

/**
 * 34 tỉnh/thành phố Việt Nam sau sáp nhập (Nghị quyết 202/2025/QH15).
 * Mã số theo Danh sách mã số 34 tỉnh, thành phố mới.
<<<<<<< Updated upstream
 * nameVi: tên đầy đủ có dấu, khớp với ten_tinh trong GeoJSON.
=======
<<<<<<< HEAD
=======
 * nameVi: tên đầy đủ có dấu, khớp với ten_tinh trong GeoJSON.
>>>>>>> 6fd922c3aa8d363c16bbb45a45ef27094466bd7d
>>>>>>> Stashed changes
 * Mock data: products, farmingTypes, activeFarms, avgPrice là dữ liệu mẫu cho ITE1.
 */
export const vietnamProvinces: VietnamProvince[] = [
  // ── BẮC BỘ ──────────────────────────────────────────────
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
  { code: "01", name: "Ha Noi", region: "North", lat: 21.0285, lng: 105.8542, products: ["Vegetables", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 820, avgPrice: 18000 },
  { code: "04", name: "Cao Bang", region: "North", lat: 22.6657, lng: 106.257, products: ["Rice", "Chestnut"], farmingTypes: ["Traditional"], activeFarms: 290, avgPrice: 20000 },
  { code: "08", name: "Tuyen Quang", region: "North", lat: 21.7767, lng: 105.228, products: ["Tea", "Orange"], farmingTypes: ["Organic", "VietGAP"], activeFarms: 670, avgPrice: 22500 },
  { code: "11", name: "Dien Bien", region: "North", lat: 21.386, lng: 103.0166, products: ["Rice", "Coffee"], farmingTypes: ["Traditional"], activeFarms: 280, avgPrice: 19000 },
  { code: "12", name: "Lai Chau", region: "North", lat: 22.3862, lng: 103.4703, products: ["Tea", "Macadamia"], farmingTypes: ["Organic"], activeFarms: 260, avgPrice: 28000 },
  { code: "14", name: "Son La", region: "North", lat: 21.327, lng: 103.9141, products: ["Mango", "Coffee"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 720, avgPrice: 25000 },
  { code: "15", name: "Lao Cai", region: "North", lat: 22.4856, lng: 103.9707, products: ["Vegetables", "Tea"], farmingTypes: ["Organic", "VietGAP"], activeFarms: 780, avgPrice: 24500 },
  { code: "19", name: "Thai Nguyen", region: "North", lat: 21.5672, lng: 105.8252, products: ["Tea", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 770, avgPrice: 25000 },
  { code: "20", name: "Lang Son", region: "North", lat: 21.8537, lng: 106.7615, products: ["Star anise", "Vegetables"], farmingTypes: ["Traditional"], activeFarms: 300, avgPrice: 25000 },
  { code: "22", name: "Quang Ninh", region: "North", lat: 21.0064, lng: 107.2925, products: ["Seafood", "Vegetables"], farmingTypes: ["VietGAP"], activeFarms: 460, avgPrice: 32000 },
  { code: "24", name: "Bac Ninh", region: "North", lat: 21.1861, lng: 106.0763, products: ["Lychee", "Rice", "Vegetables"], farmingTypes: ["VietGAP"], activeFarms: 1180, avgPrice: 24000 },
  { code: "25", name: "Phu Tho", region: "North", lat: 21.2684, lng: 105.2046, products: ["Tea", "Pomelo", "Orange"], farmingTypes: ["Traditional", "VietGAP"], activeFarms: 1230, avgPrice: 22000 },
  { code: "31", name: "Hai Phong", region: "North", lat: 20.8449, lng: 106.6881, products: ["Seafood", "Carrot", "Rice"], farmingTypes: ["VietGAP"], activeFarms: 990, avgPrice: 26000 },
  { code: "33", name: "Hung Yen", region: "North", lat: 20.8526, lng: 106.016, products: ["Longan", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 1050, avgPrice: 22000 },
  { code: "37", name: "Ninh Binh", region: "North", lat: 20.2506, lng: 105.9745, products: ["Rice", "Banana", "Seafood"], farmingTypes: ["Traditional"], activeFarms: 1150, avgPrice: 19000 },

  // ── BẮC TRUNG BỘ & DUYÊN HẢI MIỀN TRUNG ───────────────
  { code: "38", name: "Thanh Hoa", region: "Central", lat: 19.8067, lng: 105.7852, products: ["Sugarcane", "Rice"], farmingTypes: ["Traditional"], activeFarms: 760, avgPrice: 19000 },
  { code: "40", name: "Nghe An", region: "Central", lat: 19.2342, lng: 104.92, products: ["Orange", "Tea"], farmingTypes: ["VietGAP"], activeFarms: 850, avgPrice: 22000 },
  { code: "42", name: "Ha Tinh", region: "Central", lat: 18.3559, lng: 105.8877, products: ["Rice", "Peanut"], farmingTypes: ["Traditional"], activeFarms: 430, avgPrice: 18000 },
  { code: "44", name: "Quang Tri", region: "Central", lat: 16.7403, lng: 107.1855, products: ["Pepper", "Seafood", "Rice"], farmingTypes: ["Traditional", "Organic"], activeFarms: 590, avgPrice: 24500 },
  { code: "46", name: "Hue", region: "Central", lat: 16.4637, lng: 107.5909, products: ["Rice", "Vegetables"], farmingTypes: ["VietGAP"], activeFarms: 360, avgPrice: 20000 },
  { code: "48", name: "Da Nang", region: "Central", lat: 16.0471, lng: 108.2068, products: ["Vegetables", "Seafood", "Herbs"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 640, avgPrice: 25000 },
  { code: "51", name: "Quang Ngai", region: "Central", lat: 15.1214, lng: 108.8044, products: ["Garlic", "Sugarcane", "Coffee"], farmingTypes: ["Traditional"], activeFarms: 810, avgPrice: 27000 },
  { code: "52", name: "Gia Lai", region: "Highlands", lat: 13.8079, lng: 108.1094, products: ["Coffee", "Pepper", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 1150, avgPrice: 26000 },
  { code: "56", name: "Khanh Hoa", region: "Central", lat: 12.2585, lng: 109.0526, products: ["Seafood", "Mango", "Grape"], farmingTypes: ["VietGAP"], activeFarms: 790, avgPrice: 31500 },
  { code: "66", name: "Dak Lak", region: "Highlands", lat: 12.71, lng: 108.2378, products: ["Coffee", "Durian", "Tuna"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 1330, avgPrice: 34000 },

  // ── TÂY NGUYÊN & NAM BỘ ────────────────────────────────
  { code: "68", name: "Lam Dong", region: "Highlands", lat: 11.5753, lng: 108.1429, products: ["Vegetables", "Coffee", "Flowers", "Dragon fruit"], farmingTypes: ["VietGAP", "Organic", "GlobalGAP"], activeFarms: 2650, avgPrice: 31000 },
  { code: "75", name: "Dong Nai", region: "South", lat: 11.0686, lng: 107.1676, products: ["Fruit", "Pepper", "Cashew"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 1400, avgPrice: 28000 },
  { code: "79", name: "Ho Chi Minh City", region: "South", lat: 10.8231, lng: 106.6297, products: ["Vegetables", "Orchid", "Seafood"], farmingTypes: ["VietGAP"], activeFarms: 1100, avgPrice: 31000 },
  { code: "80", name: "Tay Ninh", region: "South", lat: 11.3352, lng: 106.1099, products: ["Cassava", "Sugarcane", "Rice", "Dragon fruit"], farmingTypes: ["Traditional", "VietGAP"], activeFarms: 1230, avgPrice: 20000 },
  { code: "82", name: "Dong Thap", region: "South", lat: 10.4938, lng: 105.6882, products: ["Lotus", "Rice", "Mango", "Durian"], farmingTypes: ["Traditional", "VietGAP", "GlobalGAP"], activeFarms: 3080, avgPrice: 25000 },
  { code: "86", name: "Vinh Long", region: "South", lat: 10.2396, lng: 105.9572, products: ["Coconut", "Pomelo", "Rice"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 2290, avgPrice: 22000 },
  { code: "91", name: "An Giang", region: "South", lat: 10.5216, lng: 105.1259, products: ["Rice", "Fish", "Seafood"], farmingTypes: ["Traditional"], activeFarms: 2020, avgPrice: 23500 },
  { code: "92", name: "Can Tho", region: "South", lat: 10.0452, lng: 105.7469, products: ["Rice", "Fruit", "ST25 rice", "Pineapple"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 2830, avgPrice: 24000 },
  { code: "96", name: "Ca Mau", region: "South", lat: 9.1768, lng: 105.1524, products: ["Shrimp", "Crab", "Rice"], farmingTypes: ["Organic"], activeFarms: 1550, avgPrice: 33000 },
=======
>>>>>>> Stashed changes
  { code: "01", name: "Ha Noi", nameVi: "Hà Nội", region: "North", regionVi: "Miền Bắc", slug: "ha-noi", sapNhap: "không sáp nhập", lat: 21.0285, lng: 105.8542, products: ["Vegetables", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 820, avgPrice: 18000, danSo: 8807523, dienTich: 3360 },
  { code: "04", name: "Cao Bang", nameVi: "Cao Bằng", region: "North", regionVi: "Miền Bắc", slug: "cao-bang", sapNhap: "không sáp nhập", lat: 22.6657, lng: 106.257, products: ["Rice", "Chestnut"], farmingTypes: ["Traditional"], activeFarms: 290, avgPrice: 20000, danSo: 573119, dienTich: 6700 },
  { code: "08", name: "Tuyen Quang", nameVi: "Tuyên Quang", region: "North", regionVi: "Miền Bắc", slug: "tuyen-quang", sapNhap: "Tuyên Quang, Hà Giang", lat: 21.7767, lng: 105.228, products: ["Tea", "Orange"], farmingTypes: ["Organic", "VietGAP"], activeFarms: 670, avgPrice: 22500, danSo: 1858056, dienTich: 13521 },
  { code: "11", name: "Dien Bien", nameVi: "Điện Biên", region: "North", regionVi: "Miền Bắc", slug: "dien-bien", sapNhap: "không sáp nhập", lat: 21.386, lng: 103.0166, products: ["Rice", "Coffee"], farmingTypes: ["Traditional"], activeFarms: 280, avgPrice: 19000, danSo: 673091, dienTich: 9563 },
  { code: "12", name: "Lai Chau", nameVi: "Lai Châu", region: "North", regionVi: "Miền Bắc", slug: "lai-chau", sapNhap: "không sáp nhập", lat: 22.3862, lng: 103.4703, products: ["Tea", "Macadamia"], farmingTypes: ["Organic"], activeFarms: 260, avgPrice: 28000, danSo: 512601, dienTich: 9069 },
  { code: "14", name: "Son La", nameVi: "Sơn La", region: "North", regionVi: "Miền Bắc", slug: "son-la", sapNhap: "không sáp nhập", lat: 21.327, lng: 103.9141, products: ["Mango", "Coffee"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 720, avgPrice: 25000, danSo: 1404587, dienTich: 14175 },
  { code: "15", name: "Lao Cai", nameVi: "Lào Cai", region: "North", regionVi: "Miền Bắc", slug: "lao-cai", sapNhap: "Lào Cai, Yên Bái", lat: 22.4856, lng: 103.9707, products: ["Vegetables", "Tea"], farmingTypes: ["Organic", "VietGAP"], activeFarms: 780, avgPrice: 24500, danSo: 1770645, dienTich: 13298 },
  { code: "19", name: "Thai Nguyen", nameVi: "Thái Nguyên", region: "North", regionVi: "Miền Bắc", slug: "thai-nguyen", sapNhap: "Bắc Kạn, Thái Nguyên", lat: 21.5672, lng: 105.8252, products: ["Tea", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 770, avgPrice: 25000, danSo: 1799489, dienTich: 8398 },
  { code: "20", name: "Lang Son", nameVi: "Lạng Sơn", region: "North", regionVi: "Miền Bắc", slug: "lang-son", sapNhap: "không sáp nhập", lat: 21.8537, lng: 106.7615, products: ["Star anise", "Vegetables"], farmingTypes: ["Traditional"], activeFarms: 300, avgPrice: 25000, danSo: 881384, dienTich: 8310 },
  { code: "22", name: "Quang Ninh", nameVi: "Quảng Ninh", region: "North", regionVi: "Miền Bắc", slug: "quang-ninh", sapNhap: "không sáp nhập", lat: 21.0064, lng: 107.2925, products: ["Seafood", "Vegetables"], farmingTypes: ["VietGAP"], activeFarms: 460, avgPrice: 32000, danSo: 1497447, dienTich: 6178 },
  { code: "24", name: "Bac Ninh", nameVi: "Bắc Ninh", region: "North", regionVi: "Miền Bắc", slug: "bac-ninh", sapNhap: "Bắc Ninh, Bắc Giang", lat: 21.1861, lng: 106.0763, products: ["Lychee", "Rice", "Vegetables"], farmingTypes: ["VietGAP"], activeFarms: 1180, avgPrice: 24000, danSo: 2059480, dienTich: 4719 },
  { code: "25", name: "Phu Tho", nameVi: "Phú Thọ", region: "North", regionVi: "Miền Bắc", slug: "phu-tho", sapNhap: "Vĩnh Phúc, Phú Thọ, Hòa Bình", lat: 21.2684, lng: 105.2046, products: ["Tea", "Pomelo", "Orange"], farmingTypes: ["Traditional", "VietGAP"], activeFarms: 1230, avgPrice: 22000, danSo: 4022493, dienTich: 9095 },
  { code: "31", name: "Hai Phong", nameVi: "Hải Phòng", region: "North", regionVi: "Miền Bắc", slug: "hai-phong", sapNhap: "Hải Dương, Hải Phòng", lat: 20.8449, lng: 106.6881, products: ["Seafood", "Carrot", "Rice"], farmingTypes: ["VietGAP"], activeFarms: 990, avgPrice: 26000, danSo: 4664124, dienTich: 3340 },
  { code: "33", name: "Hung Yen", nameVi: "Hưng Yên", region: "North", regionVi: "Miền Bắc", slug: "hung-yen", sapNhap: "Hưng Yên, Thái Bình", lat: 20.8526, lng: 106.016, products: ["Longan", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 1050, avgPrice: 22000, danSo: 3567943, dienTich: 2431 },
  { code: "37", name: "Ninh Binh", nameVi: "Ninh Bình", region: "North", regionVi: "Miền Bắc", slug: "ninh-binh", sapNhap: "Hà Nam, Ninh Bình, Nam Định", lat: 20.2506, lng: 105.9745, products: ["Rice", "Banana", "Seafood"], farmingTypes: ["Traditional"], activeFarms: 1150, avgPrice: 19000, danSo: 4412264, dienTich: 3748 },

  // ── MIỀN TRUNG ──────────────────────────────────────────
  { code: "38", name: "Thanh Hoa", nameVi: "Thanh Hóa", region: "Central", regionVi: "Miền Trung", slug: "thanh-hoa", sapNhap: "không sáp nhập", lat: 19.8067, lng: 105.7852, products: ["Sugarcane", "Rice"], farmingTypes: ["Traditional"], activeFarms: 760, avgPrice: 19000, danSo: 4320947, dienTich: 11116 },
  { code: "40", name: "Nghe An", nameVi: "Nghệ An", region: "Central", regionVi: "Miền Trung", slug: "nghe-an", sapNhap: "không sáp nhập", lat: 19.2342, lng: 104.92, products: ["Orange", "Tea"], farmingTypes: ["VietGAP"], activeFarms: 850, avgPrice: 22000, danSo: 3831694, dienTich: 16494 },
  { code: "42", name: "Ha Tinh", nameVi: "Hà Tĩnh", region: "Central", regionVi: "Miền Trung", slug: "ha-tinh", sapNhap: "không sáp nhập", lat: 18.3559, lng: 105.8877, products: ["Rice", "Peanut"], farmingTypes: ["Traditional"], activeFarms: 430, avgPrice: 18000, danSo: 1623061, dienTich: 6055 },
  { code: "44", name: "Quang Tri", nameVi: "Quảng Trị", region: "Central", regionVi: "Miền Trung", slug: "quang-tri", sapNhap: "Quảng Trị, Quảng Bình", lat: 16.7403, lng: 107.1855, products: ["Pepper", "Seafood", "Rice"], farmingTypes: ["Traditional", "Organic"], activeFarms: 590, avgPrice: 24500, danSo: 1870844, dienTich: 8065 },
  { code: "46", name: "Hue", nameVi: "Huế", region: "Central", regionVi: "Miền Trung", slug: "hue", sapNhap: "không sáp nhập", lat: 16.4637, lng: 107.5909, products: ["Rice", "Vegetables"], farmingTypes: ["VietGAP"], activeFarms: 360, avgPrice: 20000, danSo: 1432986, dienTich: 5033 },
  { code: "48", name: "Da Nang", nameVi: "Đà Nẵng", region: "Central", regionVi: "Miền Trung", slug: "da-nang", sapNhap: "Đà Nẵng, Quảng Nam", lat: 16.0471, lng: 108.2068, products: ["Vegetables", "Seafood", "Herbs"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 640, avgPrice: 25000, danSo: 3122915, dienTich: 11575 },
  { code: "51", name: "Quang Ngai", nameVi: "Quảng Ngãi", region: "Central", regionVi: "Miền Trung", slug: "quang-ngai", sapNhap: "Quảng Ngãi, Kon Tum", lat: 15.1214, lng: 108.8044, products: ["Garlic", "Sugarcane", "Coffee"], farmingTypes: ["Traditional"], activeFarms: 810, avgPrice: 27000, danSo: 2161735, dienTich: 14662 },
  { code: "56", name: "Khanh Hoa", nameVi: "Khánh Hòa", region: "Central", regionVi: "Miền Trung", slug: "khanh-hoa", sapNhap: "Khánh Hòa, Ninh Thuận", lat: 12.2585, lng: 109.0526, products: ["Seafood", "Mango", "Grape"], farmingTypes: ["VietGAP"], activeFarms: 790, avgPrice: 31500, danSo: 2243553, dienTich: 9018 },

  // ── TÂY NGUYÊN ──────────────────────────────────────────
  { code: "52", name: "Gia Lai", nameVi: "Gia Lai", region: "Highlands", regionVi: "Tây Nguyên", slug: "gia-lai", sapNhap: "Gia Lai, Bình Định", lat: 13.8079, lng: 108.1094, products: ["Coffee", "Pepper", "Rice"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 1150, avgPrice: 26000, danSo: 3583691, dienTich: 21548 },
  { code: "66", name: "Dak Lak", nameVi: "Đắk Lắk", region: "Highlands", regionVi: "Tây Nguyên", slug: "dak-lak", sapNhap: "Đắk Lắk, Phú Yên", lat: 12.71, lng: 108.2378, products: ["Coffee", "Durian", "Tuna"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 1330, avgPrice: 34000, danSo: 3346853, dienTich: 18540 },
  { code: "68", name: "Lam Dong", nameVi: "Lâm Đồng", region: "Highlands", regionVi: "Tây Nguyên", slug: "lam-dong", sapNhap: "Lâm Đồng, Đắk Nông, Bình Thuận", lat: 11.5753, lng: 108.1429, products: ["Vegetables", "Coffee", "Flowers", "Dragon fruit"], farmingTypes: ["VietGAP", "Organic", "GlobalGAP"], activeFarms: 2650, avgPrice: 31000, danSo: 3872999, dienTich: 25041 },

  // ── NAM BỘ ──────────────────────────────────────────────
  { code: "75", name: "Dong Nai", nameVi: "Đồng Nai", region: "South", regionVi: "Miền Nam", slug: "dong-nai", sapNhap: "Đồng Nai, Bình Phước", lat: 11.0686, lng: 107.1676, products: ["Fruit", "Pepper", "Cashew"], farmingTypes: ["VietGAP", "Traditional"], activeFarms: 1400, avgPrice: 28000, danSo: 4491408, dienTich: 12711 },
  { code: "79", name: "Ho Chi Minh City", nameVi: "TP. Hồ Chí Minh", region: "South", regionVi: "Miền Nam", slug: "tp-ho-chi-minh", sapNhap: "Thành phố Hồ Chí Minh, Bà Rịa - Vũng Tàu, Bình Dương", lat: 10.8231, lng: 106.6297, products: ["Vegetables", "Orchid", "Seafood"], farmingTypes: ["VietGAP"], activeFarms: 1100, avgPrice: 31000, danSo: 14668098, dienTich: 5351 },
  { code: "80", name: "Tay Ninh", nameVi: "Tây Ninh", region: "South", regionVi: "Miền Nam", slug: "tay-ninh", sapNhap: "Tây Ninh, Long An", lat: 11.3352, lng: 106.1099, products: ["Cassava", "Sugarcane", "Rice", "Dragon fruit"], farmingTypes: ["Traditional", "VietGAP"], activeFarms: 1230, avgPrice: 20000, danSo: 3254170, dienTich: 8603 },
  { code: "82", name: "Dong Thap", nameVi: "Đồng Tháp", region: "South", regionVi: "Miền Nam", slug: "dong-thap", sapNhap: "Tiền Giang, Đồng Tháp", lat: 10.4938, lng: 105.6882, products: ["Lotus", "Rice", "Mango", "Durian"], farmingTypes: ["Traditional", "VietGAP", "GlobalGAP"], activeFarms: 3080, avgPrice: 25000, danSo: 4370046, dienTich: 5937 },
  { code: "86", name: "Vinh Long", nameVi: "Vĩnh Long", region: "South", regionVi: "Miền Nam", slug: "vinh-long", sapNhap: "Vĩnh Long, Bến Tre, Trà Vinh", lat: 10.2396, lng: 105.9572, products: ["Coconut", "Pomelo", "Rice"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 2290, avgPrice: 22000, danSo: 4257581, dienTich: 5878 },
  { code: "91", name: "An Giang", nameVi: "An Giang", region: "South", regionVi: "Miền Nam", slug: "an-giang", sapNhap: "An Giang, Kiên Giang", lat: 10.5216, lng: 105.1259, products: ["Rice", "Fish", "Seafood"], farmingTypes: ["Traditional"], activeFarms: 2020, avgPrice: 23500, danSo: 4995214, dienTich: 9987 },
  { code: "92", name: "Can Tho", nameVi: "Cần Thơ", region: "South", regionVi: "Miền Nam", slug: "can-tho", sapNhap: "Cần Thơ, Sóc Trăng, Hậu Giang", lat: 10.0452, lng: 105.7469, products: ["Rice", "Fruit", "ST25 rice", "Pineapple"], farmingTypes: ["VietGAP", "Organic"], activeFarms: 2830, avgPrice: 24000, danSo: 4112487, dienTich: 6361 },
  { code: "96", name: "Ca Mau", nameVi: "Cà Mau", region: "South", regionVi: "Miền Nam", slug: "ca-mau", sapNhap: "Cà Mau, Bạc Liêu", lat: 9.1768, lng: 105.1524, products: ["Shrimp", "Crab", "Rice"], farmingTypes: ["Organic"], activeFarms: 1550, avgPrice: 33000, danSo: 1988464, dienTich: 6310 },
<<<<<<< Updated upstream
=======
>>>>>>> 6fd922c3aa8d363c16bbb45a45ef27094466bd7d
>>>>>>> Stashed changes
];
