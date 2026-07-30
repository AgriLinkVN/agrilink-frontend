"use client";

import ReactDOM from "react-dom";
import { MapExperience } from "./map-experience";

export default function MapPage() {
  ReactDOM.preconnect("https://api.mapbox.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://events.mapbox.com", {
    crossOrigin: "anonymous",
  });

  return <MapExperience />;
}
