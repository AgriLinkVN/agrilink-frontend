import type {
  CategorySummary,
  DataMode,
  DataSourceMetadata,
  MarketPricePoint,
  MarketPriceQuery,
  ProductQuery,
  ProductSummary,
  ProvinceSummary,
  TraceBatch,
} from "./contracts";

export interface P4DataSource {
  getMetadata(): DataSourceMetadata;
  listCategories(): Promise<CategorySummary[]>;
  listProducts(query?: ProductQuery): Promise<ProductSummary[]>;
  listProvinces(): Promise<ProvinceSummary[]>;
  listMarketPrices(query?: MarketPriceQuery): Promise<MarketPricePoint[]>;
  getTraceByQr(qrCode: string): Promise<TraceBatch | null>;
}

export class P4DataSourceUnavailableError extends Error {
  readonly mode: DataMode;
  readonly operation: string;

  constructor(mode: DataMode, operation: string, message?: string) {
    super(
      message ??
        `Nguồn dữ liệu ${mode} chưa sẵn sàng cho thao tác ${operation}.`,
    );
    this.name = "P4DataSourceUnavailableError";
    this.mode = mode;
    this.operation = operation;
  }
}
