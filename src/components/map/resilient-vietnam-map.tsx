"use client";

import { MapPinOff, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getMapUnavailableMessage,
  resolveInitialMapState,
  type MapRuntimeState,
} from "./map-runtime-state";
import {
  VietnamMapbox,
  type VietnamMapStyle,
} from "./vietnam-mapbox";

const MAPBOX_READY_TIMEOUT_MS = 8_000;

interface ResilientVietnamMapProps {
  mapStyle?: VietnamMapStyle;
  selectedProvinceCode?: string | null;
  visibleProvinceCodes?: string[];
  onProvinceClick?: (code: string) => void;
  onMapboxReadyChange?: (isReady: boolean) => void;
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
  mapStyle = "outdoors",
  selectedProvinceCode,
  visibleProvinceCodes,
  onProvinceClick,
  onMapboxReadyChange,
}: ResilientVietnamMapProps) {
  const hasMapboxToken = Boolean(
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim(),
  );
  const [attempt, setAttempt] = useState(0);
  const [runtimeState, setRuntimeState] = useState<MapRuntimeState>(() =>
    resolveInitialMapState({ hasMapboxToken }),
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const initialState = resolveInitialMapState({ hasMapboxToken });

      if (initialState.kind === "unavailable") {
        setRuntimeState(initialState);
        return;
      }

      if (!supportsWebGl()) {
        setRuntimeState({
          kind: "unavailable",
          reason: "webgl-unavailable",
        });
        return;
      }

      setRuntimeState({ kind: "loading" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [attempt, hasMapboxToken]);

  useEffect(() => {
    if (runtimeState.kind !== "loading") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRuntimeState({
        kind: "error-with-retry",
        message:
          "Mapbox mất quá nhiều thời gian để tải. Vui lòng kiểm tra kết nối và thử lại.",
      });
    }, MAPBOX_READY_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [runtimeState.kind]);

  const handleMapboxError = useCallback(() => {
    setRuntimeState({
      kind: "error-with-retry",
      message:
        "Không thể kết nối Mapbox. Vui lòng kiểm tra kết nối và thử lại.",
    });
  }, []);

  const retryMapbox = useCallback(() => {
    setAttempt((currentAttempt) => currentAttempt + 1);
  }, []);

  useEffect(() => {
    onMapboxReadyChange?.(runtimeState.kind === "mapbox-ready");
  }, [onMapboxReadyChange, runtimeState.kind]);

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
          mapStyle={mapStyle}
          selectedProvinceCode={selectedProvinceCode}
          visibleProvinceCodes={visibleProvinceCodes}
          onProvinceClick={onProvinceClick}
          onReady={() => setRuntimeState({ kind: "mapbox-ready" })}
          onError={handleMapboxError}
        />
      ) : (
        <div className="absolute inset-0 bg-[#eef1ec]" aria-hidden="true" />
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

        {runtimeState.kind === "unavailable" ? (
          <div className="absolute inset-0 z-10 grid place-items-center p-6">
            <div className="max-w-sm rounded-xl border border-hairline bg-white p-5 text-center shadow-sm">
              <MapPinOff
                aria-hidden="true"
                className="mx-auto text-muted"
                size={28}
              />
              <p className="mt-3 font-semibold text-ink">
                Bản đồ chưa khả dụng
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {getMapUnavailableMessage(runtimeState.reason)}
              </p>
            </div>
          </div>
        ) : null}

        {runtimeState.kind === "error-with-retry" ? (
          <div className="absolute inset-0 z-10 grid place-items-center p-6">
            <div className="max-w-sm rounded-xl border border-hairline bg-white p-5 text-center shadow-sm">
              <MapPinOff
                aria-hidden="true"
                className="mx-auto text-muted"
                size={28}
              />
              <p className="mt-3 font-semibold text-ink">
                Không thể tải bản đồ
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {runtimeState.message}
              </p>
              <Button
                className="mt-4"
                size="sm"
                type="button"
                variant="secondary"
                onClick={retryMapbox}
              >
                <RefreshCw aria-hidden="true" size={14} />
                Thử lại Mapbox
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
