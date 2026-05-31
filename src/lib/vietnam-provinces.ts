export type VietnamProvince = {
  code: string;
  name: string;
  region: "North" | "Central" | "Highlands" | "South";
  lat: number;
  lng: number;
  products: string[];
  farmingTypes: string[];
  activeFarms: number;
  avgPrice: number;
};

/**
 * 34 tỉnh/thành phố Việt Nam sau sáp nhập (Nghị quyết 202/2025/QH15).
 * Mã số theo Danh sách mã số 34 tỉnh, thành phố mới.
 * Mock data: products, farmingTypes, activeFarms, avgPrice là dữ liệu mẫu cho ITE1.
 */
export const vietnamProvinces: VietnamProvince[] = [
  // ── BẮC BỘ ──────────────────────────────────────────────
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
];
