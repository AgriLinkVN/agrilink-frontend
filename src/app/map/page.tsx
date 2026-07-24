"use client";

import ReactDOM from "react-dom";
import { use } from "react";
import { MapExperience } from "./map-experience";

type MapSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function MapPage({
  searchParams,
}: {
  searchParams: MapSearchParams;
}) {
  const query = use(searchParams);
  const isDemo = getFirstSearchParam(query.demo) === "1";

  ReactDOM.preconnect("https://api.mapbox.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://events.mapbox.com", {
    crossOrigin: "anonymous",
  });

  return <MapExperience isDemo={isDemo} />;
}
