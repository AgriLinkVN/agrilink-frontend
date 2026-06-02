"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getOfflineFallbackMessage,
  resolveInitialMapState,
  type MapRuntimeState,
} from "./map-runtime-state";
import { VietnamMapbox } from "./vietnam-mapbox";
import { VietnamSvgMap } from "./vietnam-svg-map";

const MAPBOX_READY_TIMEOUT_MS = 8_000;

interface ResilientVietnamMapProps {
  forceOffline?: boolean;
  selectedProvinceCode?: string | null;
  visibleProvinceCodes?: string[];
  onProvinceClick?: (code: string) => void;
}

function supportsWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function ResilientVietnamMap({
  forceOffline = false,
  selectedProvinceCode,
  visibleProvinceCodes,
  onProvinceClick,
}: ResilientVietnamMapProps) {
  const hasMapboxToken = Boolean(
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim(),
  );
  const [attempt, setAttempt] = useState(0);
  const [runtimeState, setRuntimeState] = useState<MapRuntimeState>(() =>
    resolveInitialMapState({ forceOffline, hasMapboxToken }),
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const initialState = resolveInitialMapState({
        forceOffline,
        hasMapboxToken,
      });

      if (initialState.kind === "offline-fallback") {
        setRuntimeState(initialState);
        return;
      }

      if (!supportsWebGl()) {
        setRuntimeState({
          kind: "offline-fallback",
          reason: "webgl-unavailable",
        });
        return;
      }

      setRuntimeState({ kind: "loading" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [attempt, forceOffline, hasMapboxToken]);

  useEffect(() => {
    if (runtimeState.kind !== "loading") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRuntimeState({
        kind: "error-with-retry",
        message:
          "Mapbox mất quá nhiều thời gian để tải. Bản đồ ngoại tuyến đã được bật.",
      });
    }, MAPBOX_READY_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [runtimeState.kind]);

  const handleMapboxError = useCallback(() => {
    setRuntimeState({
      kind: "error-with-retry",
      message:
        "Không thể kết nối Mapbox. Bạn vẫn có thể chọn tỉnh trên bản đồ ngoại tuyến.",
    });
  }, []);

  const retryMapbox = useCallback(() => {
    setAttempt((currentAttempt) => currentAttempt + 1);
  }, []);

  const usesMapbox =
    runtimeState.kind === "loading" ||
    runtimeState.kind === "mapbox-ready";

  return (
    <div
      className="relative h-full w-full"
      data-map-state={runtimeState.kind}
    >
      {usesMapbox ? (
        <VietnamMapbox
          key={attempt}
          selectedProvinceCode={selectedProvinceCode}
          visibleProvinceCodes={visibleProvinceCodes}
          onProvinceClick={onProvinceClick}
          onReady={() => setRuntimeState({ kind: "mapbox-ready" })}
          onError={handleMapboxError}
        />
      ) : (
        <VietnamSvgMap
          selectedProvinceCode={selectedProvinceCode}
          visibleProvinceCodes={visibleProvinceCodes}
          onProvinceClick={onProvinceClick}
        />
      )}

      <div aria-live="polite">
        {runtimeState.kind === "loading" ? (
          <div className="absolute inset-0 z-10 grid place-items-center bg-surface-green">
            <div
              className="rounded-lg border border-hairline bg-white px-5 py-4 text-center shadow-sm"
              role="status"
            >
              <p className="font-semibold text-ink">Đang tải bản đồ</p>
              <p className="mt-1 text-sm text-muted">
                Đang chuẩn bị dữ liệu tỉnh thành.
              </p>
            </div>
          </div>
        ) : null}

        {runtimeState.kind === "offline-fallback" ? (
          <div className="absolute bottom-4 left-4 z-10 max-w-sm rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-950 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <WifiOff aria-hidden="true" size={16} />
              Bản đồ ngoại tuyến
            </div>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">
              {getOfflineFallbackMessage(runtimeState.reason)}
            </p>
          </div>
        ) : null}

        {runtimeState.kind === "error-with-retry" ? (
          <div className="absolute bottom-4 left-4 z-10 max-w-sm rounded-lg border border-amber-300 bg-white p-4 shadow-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <WifiOff aria-hidden="true" className="text-amber-700" size={16} />
              Đang dùng bản đồ ngoại tuyến
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {runtimeState.message}
            </p>
            <Button
              className="mt-3"
              size="sm"
              type="button"
              variant="secondary"
              onClick={retryMapbox}
            >
              <RefreshCw aria-hidden="true" size={14} />
              Thử lại Mapbox
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
