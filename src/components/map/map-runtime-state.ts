export type OfflineFallbackReason =
  | "forced-offline"
  | "missing-token"
  | "webgl-unavailable";

export type MapRuntimeState =
  | { kind: "loading" }
  | { kind: "mapbox-ready" }
  | {
      kind: "offline-fallback";
      reason: OfflineFallbackReason;
    }
  | {
      kind: "error-with-retry";
      message: string;
    };

interface InitialMapStateOptions {
  forceOffline: boolean;
  hasMapboxToken: boolean;
}

export function resolveInitialMapState({
  forceOffline,
  hasMapboxToken,
}: InitialMapStateOptions): MapRuntimeState {
  if (forceOffline) {
    return {
      kind: "offline-fallback",
      reason: "forced-offline",
    };
  }

  if (!hasMapboxToken) {
    return {
      kind: "offline-fallback",
      reason: "missing-token",
    };
  }

  return { kind: "loading" };
}

export function getOfflineFallbackMessage(
  reason: OfflineFallbackReason,
): string {
  switch (reason) {
    case "forced-offline":
      return "Chế độ ngoại tuyến đang được bật cho buổi trình bày.";
    case "missing-token":
      return "Mapbox chưa được cấu hình. Bản đồ SVG vẫn cho phép chọn tỉnh.";
    case "webgl-unavailable":
      return "Thiết bị không hỗ trợ WebGL. Bản đồ SVG đang được sử dụng.";
  }
}
