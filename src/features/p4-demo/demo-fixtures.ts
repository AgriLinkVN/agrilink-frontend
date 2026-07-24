import type {
  CategorySummary,
  DemoFixtures,
  MarketPricePoint,
  ProductSummary,
  ProvinceSummary,
  TraceBatch,
} from "./contracts";

export const DEMO_AS_OF = "2026-07-24";
export const DEMO_DISCLOSURE =
  "Dữ liệu minh họa phục vụ trình bày, không phải dữ liệu thị trường thời gian thực.";

const SOURCE_LABEL = "Bộ dữ liệu demo AgriLink";

export const DEMO_CATEGORIES: CategorySummary[] = [
  { id: "cat-fruit", name: "Trái cây", slug: "trai-cay" },
  {
    id: "cat-industrial-crop",
    name: "Cây công nghiệp",
    slug: "cay-cong-nghiep",
  },
  { id: "cat-rice", name: "Lúa gạo", slug: "lua-gao" },
];

export const DEMO_PRODUCTS: ProductSummary[] = [
  {
    id: "product-mango-cat-hoa-loc",
    categoryId: "cat-fruit",
    name: "Xoài cát Hòa Lộc",
    unit: "kg",
    farmingType: "vietgap",
    provinceCodes: ["82"],
  },
  {
    id: "product-coffee-arabica",
    categoryId: "cat-industrial-crop",
    name: "Cà phê Arabica",
    unit: "kg",
    farmingType: "organic",
    provinceCodes: ["68"],
  },
  {
    id: "product-rice-st25",
    categoryId: "cat-rice",
    name: "Gạo ST25",
    unit: "kg",
    farmingType: "vietgap",
    provinceCodes: ["92"],
  },
];

export const DEMO_PROVINCES: ProvinceSummary[] = [
  {
    code: "82",
    name: "Đồng Tháp",
    region: "south",
    center: { lat: 10.4938, lng: 105.6882 },
    productIds: ["product-mango-cat-hoa-loc"],
    farmingTypes: ["vietgap", "globalgap", "traditional"],
    activeFarms: 3080,
    isDemo: true,
  },
  {
    code: "68",
    name: "Lâm Đồng",
    region: "highlands",
    center: { lat: 11.5753, lng: 108.1429 },
    productIds: ["product-coffee-arabica"],
    farmingTypes: ["organic", "vietgap", "globalgap"],
    activeFarms: 2650,
    isDemo: true,
  },
  {
    code: "92",
    name: "Cần Thơ",
    region: "south",
    center: { lat: 10.0452, lng: 105.7469 },
    productIds: ["product-rice-st25"],
    farmingTypes: ["organic", "vietgap"],
    activeFarms: 2830,
    isDemo: true,
  },
];

const PRICE_DATES = [
  "2026-07-11",
  "2026-07-12",
  "2026-07-13",
  "2026-07-14",
  "2026-07-15",
  "2026-07-16",
  "2026-07-17",
  "2026-07-18",
  "2026-07-19",
  "2026-07-20",
  "2026-07-21",
  "2026-07-22",
  "2026-07-23",
  "2026-07-24",
] as const;

interface PriceSeriesSeed {
  idPrefix: string;
  productId: string;
  categoryId: string;
  provinceCode: string;
  averages: readonly number[];
  spread: number;
}

function buildPriceSeries(seed: PriceSeriesSeed): MarketPricePoint[] {
  if (seed.averages.length !== PRICE_DATES.length) {
    throw new Error(
      `${seed.idPrefix} phải có đúng ${PRICE_DATES.length} điểm giá demo.`,
    );
  }

  return PRICE_DATES.map((date, index) => {
    const averagePrice = seed.averages[index];
    const daySpread = seed.spread + (index % 3) * 250;

    return {
      id: `${seed.idPrefix}-${date}`,
      productId: seed.productId,
      categoryId: seed.categoryId,
      provinceCode: seed.provinceCode,
      date,
      unit: "kg",
      minPrice: averagePrice - daySpread,
      maxPrice: averagePrice + daySpread,
      averagePrice,
      sourceLabel: SOURCE_LABEL,
      isDemo: true,
    };
  });
}

export const DEMO_MARKET_PRICES: MarketPricePoint[] = [
  ...buildPriceSeries({
    idPrefix: "price-mango-82",
    productId: "product-mango-cat-hoa-loc",
    categoryId: "cat-fruit",
    provinceCode: "82",
    averages: [
      42800, 43100, 42950, 43500, 43900, 44150, 43800, 44300, 44650, 44900,
      44750, 45200, 45500, 45750,
    ],
    spread: 2200,
  }),
  ...buildPriceSeries({
    idPrefix: "price-coffee-68",
    productId: "product-coffee-arabica",
    categoryId: "cat-industrial-crop",
    provinceCode: "68",
    averages: [
      118500, 119200, 119000, 120100, 120800, 121400, 121100, 122000, 122700,
      123200, 123000, 124100, 124600, 125200,
    ],
    spread: 4300,
  }),
  ...buildPriceSeries({
    idPrefix: "price-rice-92",
    productId: "product-rice-st25",
    categoryId: "cat-rice",
    provinceCode: "92",
    averages: [
      27600, 27800, 27750, 27900, 28100, 28250, 28150, 28300, 28450, 28600,
      28550, 28700, 28850, 28900,
    ],
    spread: 1400,
  }),
];

export const DEMO_TRACE_BATCHES: TraceBatch[] = [
  {
    qrCode: "AGL-MANGO-82-202607-001",
    batchCode: "MANGO-82-180726",
    productId: "product-mango-cat-hoa-loc",
    provinceCode: "82",
    producer: {
      id: "producer-demo-dong-thap",
      displayName: "HTX Minh Hòa (hồ sơ mẫu)",
      farmLabel: "Cái Bè, khu vực Tiền Giang cũ",
    },
    certifications: ["VietGAP (minh họa)"],
    events: [
      {
        id: "mango-event-planting",
        stage: "planting",
        occurredAt: "2026-02-15T07:30:00+07:00",
        locationLabel: "Vùng trồng mẫu Cái Bè",
        title: "Ghi nhận xuống giống",
        description: "Sự kiện mẫu dùng để minh họa cấu trúc truy xuất.",
      },
      {
        id: "mango-event-cultivation",
        stage: "cultivation",
        occurredAt: "2026-05-22T08:15:00+07:00",
        locationLabel: "Vùng trồng mẫu Cái Bè",
        title: "Cập nhật chăm sóc",
        description: "Nhật ký canh tác mẫu theo quy trình VietGAP.",
      },
      {
        id: "mango-event-harvest",
        stage: "harvest",
        occurredAt: "2026-07-18T06:20:00+07:00",
        locationLabel: "Vùng trồng mẫu Cái Bè",
        title: "Thu hoạch lô xoài",
        description: "Khối lượng và thời gian chỉ dùng trong kịch bản demo.",
      },
      {
        id: "mango-event-quality",
        stage: "quality",
        occurredAt: "2026-07-19T09:10:00+07:00",
        locationLabel: "Điểm kiểm tra mẫu Đồng Tháp",
        title: "Ghi nhận kiểm tra chất lượng",
        description: "Kết quả hiển thị là dữ liệu minh họa, chưa được xác minh.",
      },
      {
        id: "mango-event-packing",
        stage: "packing",
        occurredAt: "2026-07-19T14:30:00+07:00",
        locationLabel: "Điểm đóng gói mẫu Đồng Tháp",
        title: "Đóng gói lô hàng",
        description: "Mã lô được gắn với QR demo của AgriLink.",
      },
    ],
    isDemo: true,
  },
  {
    qrCode: "AGL-COFFEE-68-202607-001",
    batchCode: "COFFEE-68-160726",
    productId: "product-coffee-arabica",
    provinceCode: "68",
    producer: {
      id: "producer-demo-lam-dong",
      displayName: "Nông trại Cầu Đất (hồ sơ mẫu)",
      farmLabel: "Khu vực Cầu Đất, Lâm Đồng",
    },
    certifications: ["Hữu cơ (minh họa)"],
    events: [
      {
        id: "coffee-event-planting",
        stage: "planting",
        occurredAt: "2025-09-12T07:00:00+07:00",
        locationLabel: "Vùng trồng mẫu Cầu Đất",
        title: "Ghi nhận mùa vụ",
        description: "Sự kiện mẫu dùng để minh họa lịch sử lô cà phê.",
      },
      {
        id: "coffee-event-cultivation",
        stage: "cultivation",
        occurredAt: "2026-04-08T08:40:00+07:00",
        locationLabel: "Vùng trồng mẫu Cầu Đất",
        title: "Cập nhật chăm sóc",
        description: "Nhật ký hữu cơ trong bộ dữ liệu demo.",
      },
      {
        id: "coffee-event-harvest",
        stage: "harvest",
        occurredAt: "2026-07-16T06:00:00+07:00",
        locationLabel: "Vùng trồng mẫu Cầu Đất",
        title: "Thu hoạch chọn lọc",
        description: "Sản lượng hiển thị sau này phải giữ nhãn minh họa.",
      },
      {
        id: "coffee-event-quality",
        stage: "quality",
        occurredAt: "2026-07-17T10:20:00+07:00",
        locationLabel: "Điểm sơ chế mẫu Lâm Đồng",
        title: "Ghi nhận phân loại",
        description: "Kết quả phân loại chưa phải chứng nhận thực tế.",
      },
    ],
    isDemo: true,
  },
];

export const DEMO_FIXTURES: DemoFixtures = {
  categories: DEMO_CATEGORIES,
  products: DEMO_PRODUCTS,
  provinces: DEMO_PROVINCES,
  marketPrices: DEMO_MARKET_PRICES,
  traceBatches: DEMO_TRACE_BATCHES,
};

function assertUnique(values: string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(`${label} có giá trị trùng lặp.`);
  }
}

function assertValidDate(value: string, label: string): void {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} có ngày không hợp lệ: ${value}`);
  }
}

export function assertDemoFixtures(fixtures: DemoFixtures): void {
  assertUnique(
    fixtures.categories.map((category) => category.id),
    "Category ID",
  );
  assertUnique(
    fixtures.products.map((product) => product.id),
    "Product ID",
  );
  assertUnique(
    fixtures.provinces.map((province) => province.code),
    "Province code",
  );
  assertUnique(
    fixtures.marketPrices.map((price) => price.id),
    "Market price ID",
  );
  assertUnique(
    fixtures.traceBatches.map((batch) => batch.qrCode),
    "QR code",
  );

  const categoryIds = new Set(
    fixtures.categories.map((category) => category.id),
  );
  const productById = new Map(
    fixtures.products.map((product) => [product.id, product]),
  );
  const provinceByCode = new Map(
    fixtures.provinces.map((province) => [province.code, province]),
  );

  for (const product of fixtures.products) {
    if (!categoryIds.has(product.categoryId)) {
      throw new Error(
        `Sản phẩm ${product.id} trỏ category không tồn tại: ${product.categoryId}`,
      );
    }

    for (const provinceCode of product.provinceCodes) {
      if (!provinceByCode.has(provinceCode)) {
        throw new Error(
          `Sản phẩm ${product.id} trỏ province không tồn tại: ${provinceCode}`,
        );
      }
    }
  }

  for (const province of fixtures.provinces) {
    if (!province.isDemo) {
      throw new Error(`Province ${province.code} phải được gắn isDemo.`);
    }

    for (const productId of province.productIds) {
      const product = productById.get(productId);
      if (!product) {
        throw new Error(
          `Province ${province.code} trỏ product không tồn tại: ${productId}`,
        );
      }

      if (!product.provinceCodes.includes(province.code)) {
        throw new Error(
          `Liên kết province/product không đối xứng: ${province.code}/${productId}`,
        );
      }
    }
  }

  for (const price of fixtures.marketPrices) {
    const product = productById.get(price.productId);
    if (!product) {
      throw new Error(
        `Giá ${price.id} trỏ product không tồn tại: ${price.productId}`,
      );
    }
    if (!provinceByCode.has(price.provinceCode)) {
      throw new Error(
        `Giá ${price.id} trỏ province không tồn tại: ${price.provinceCode}`,
      );
    }
    if (price.categoryId !== product.categoryId) {
      throw new Error(`Giá ${price.id} không khớp category của product.`);
    }
    if (price.unit !== product.unit) {
      throw new Error(`Giá ${price.id} không khớp unit của product.`);
    }
    if (
      price.minPrice <= 0 ||
      price.minPrice > price.averagePrice ||
      price.averagePrice > price.maxPrice
    ) {
      throw new Error(`Giá ${price.id} vi phạm min/average/max.`);
    }
    if (!price.isDemo) {
      throw new Error(`Giá ${price.id} phải được gắn isDemo.`);
    }
    assertValidDate(price.date, `Giá ${price.id}`);
  }

  assertValidDate(DEMO_AS_OF, "DEMO_AS_OF");
  const demoCutoff = Date.parse(`${DEMO_AS_OF}T23:59:59+07:00`);

  for (const batch of fixtures.traceBatches) {
    const product = productById.get(batch.productId);
    if (!product) {
      throw new Error(
        `Trace ${batch.qrCode} trỏ product không tồn tại: ${batch.productId}`,
      );
    }
    if (!provinceByCode.has(batch.provinceCode)) {
      throw new Error(
        `Trace ${batch.qrCode} trỏ province không tồn tại: ${batch.provinceCode}`,
      );
    }
    if (!product.provinceCodes.includes(batch.provinceCode)) {
      throw new Error(
        `Trace ${batch.qrCode} không khớp vùng của product ${batch.productId}.`,
      );
    }
    if (!batch.isDemo) {
      throw new Error(`Trace ${batch.qrCode} phải được gắn isDemo.`);
    }

    assertUnique(
      batch.events.map((event) => event.id),
      `Event ID của ${batch.qrCode}`,
    );

    let previousTimestamp = Number.NEGATIVE_INFINITY;
    for (const event of batch.events) {
      assertValidDate(event.occurredAt, `Event ${event.id}`);
      const timestamp = Date.parse(event.occurredAt);
      if (timestamp < previousTimestamp) {
        throw new Error(`Timeline ${batch.qrCode} không theo thứ tự thời gian.`);
      }
      if (timestamp > demoCutoff) {
        throw new Error(`Event ${event.id} xảy ra sau DEMO_AS_OF.`);
      }
      previousTimestamp = timestamp;
    }
  }
}

assertDemoFixtures(DEMO_FIXTURES);
