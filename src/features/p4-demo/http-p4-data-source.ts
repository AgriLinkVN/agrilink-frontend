import {
  P4DataSourceUnavailableError,
  type P4DataSource,
} from "./p4-data-source";

export class HttpP4DataSource implements P4DataSource {
  getMetadata() {
    return {
      mode: "api" as const,
      asOfDate: "",
      disclosure:
        "Đang sử dụng chế độ API. Không tự động chuyển sang dữ liệu minh họa khi API lỗi.",
    };
  }

  async listCategories() {
    return this.unavailable("listCategories");
  }

  async listProducts() {
    return this.unavailable("listProducts");
  }

  async listProvinces() {
    return this.unavailable("listProvinces");
  }

  async listMarketPrices() {
    return this.unavailable("listMarketPrices");
  }

  async getTraceByQr() {
    return this.unavailable("getTraceByQr");
  }

  private unavailable(operation: string): never {
    throw new P4DataSourceUnavailableError(
      "api",
      operation,
      `API P4 chưa được nối cho thao tác ${operation}. Hãy dùng chế độ mock khi trình bày frontend.`,
    );
  }
}
