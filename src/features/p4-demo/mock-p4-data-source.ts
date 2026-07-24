import type {
  MarketPriceQuery,
  ProductQuery,
} from "./contracts";
import {
  DEMO_AS_OF,
  DEMO_DISCLOSURE,
  DEMO_FIXTURES,
} from "./demo-fixtures";
import type { P4DataSource } from "./p4-data-source";

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

export class MockP4DataSource implements P4DataSource {
  getMetadata() {
    return {
      mode: "mock" as const,
      asOfDate: DEMO_AS_OF,
      disclosure: DEMO_DISCLOSURE,
    };
  }

  async listCategories() {
    return cloneValue(DEMO_FIXTURES.categories).sort((left, right) =>
      left.name.localeCompare(right.name, "vi"),
    );
  }

  async listProducts(query: ProductQuery = {}) {
    return cloneValue(DEMO_FIXTURES.products)
      .filter(
        (product) =>
          !query.categoryId || product.categoryId === query.categoryId,
      )
      .sort((left, right) => left.name.localeCompare(right.name, "vi"));
  }

  async listProvinces() {
    return cloneValue(DEMO_FIXTURES.provinces).sort((left, right) =>
      left.name.localeCompare(right.name, "vi"),
    );
  }

  async listMarketPrices(query: MarketPriceQuery = {}) {
    if (query.from && query.to && query.from > query.to) {
      throw new RangeError(
        "Ngày bắt đầu của bộ lọc giá không được sau ngày kết thúc.",
      );
    }

    return cloneValue(DEMO_FIXTURES.marketPrices)
      .filter(
        (price) =>
          (!query.provinceCode ||
            price.provinceCode === query.provinceCode) &&
          (!query.categoryId || price.categoryId === query.categoryId) &&
          (!query.productId || price.productId === query.productId) &&
          (!query.from || price.date >= query.from) &&
          (!query.to || price.date <= query.to),
      )
      .sort(
        (left, right) =>
          left.date.localeCompare(right.date) ||
          left.productId.localeCompare(right.productId),
      );
  }

  async getTraceByQr(qrCode: string) {
    const normalizedQrCode = qrCode.trim().toUpperCase();
    const batch = DEMO_FIXTURES.traceBatches.find(
      (candidate) => candidate.qrCode === normalizedQrCode,
    );

    return batch ? cloneValue(batch) : null;
  }
}
