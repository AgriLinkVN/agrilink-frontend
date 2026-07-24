export type MapUnavailableReason =
  | "missing-token"
  | "webgl-unavailable";

export type MapRuntimeState =
  | { kind: "loading" }
  | { kind: "mapbox-ready" }
  | {
      kind: "unavailable";
      reason: MapUnavailableReason;
    }
  | {
      kind: "error-with-retry";
      message: string;
    };

interface InitialMapStateOptions {
  hasMapboxToken: boolean;
}

export function resolveInitialMapState({
  hasMapboxToken,
}: InitialMapStateOptions): MapRuntimeState {
  if (!hasMapboxToken) {
    return {
      kind: "unavailable",
      reason: "missing-token",
    };
  }

  return { kind: "loading" };
}

export function getMapUnavailableMessage(
  reason: MapUnavailableReason,
): string {
  switch (reason) {
    case "missing-token":
      return "Mapbox chưa được cấu hình cho môi trường này.";
    case "webgl-unavailable":
      return "Thiết bị hoặc trình duyệt hiện tại không hỗ trợ WebGL.";
  }
}
