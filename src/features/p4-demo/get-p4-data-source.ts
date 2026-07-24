import type { DataMode } from "./contracts";
import { HttpP4DataSource } from "./http-p4-data-source";
import { MockP4DataSource } from "./mock-p4-data-source";
import type { P4DataSource } from "./p4-data-source";

const mockDataSource = new MockP4DataSource();
const apiDataSource = new HttpP4DataSource();

export function resolveP4DataMode(
  configuredMode = process.env.NEXT_PUBLIC_P4_DATA_MODE,
): DataMode {
  const normalizedMode = configuredMode?.trim().toLowerCase();

  if (!normalizedMode || normalizedMode === "mock") {
    return "mock";
  }

  if (normalizedMode === "api") {
    return "api";
  }

  throw new Error(
    `NEXT_PUBLIC_P4_DATA_MODE phải là "mock" hoặc "api", nhận được "${configuredMode}".`,
  );
}

export function getP4DataSource(
  mode: DataMode = resolveP4DataMode(),
): P4DataSource {
  return mode === "mock" ? mockDataSource : apiDataSource;
}
