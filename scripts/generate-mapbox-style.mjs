import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = await readFile(path.join(projectRoot, ".env.local"), "utf8");
const token = envFile
  .split(/\r?\n/)
  .find((line) => line.startsWith("NEXT_PUBLIC_MAPBOX_TOKEN="))
  ?.slice("NEXT_PUBLIC_MAPBOX_TOKEN=".length)
  .trim();

if (!token) {
  throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN is missing from .env.local");
}

const response = await fetch(
  `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12?access_token=${encodeURIComponent(token)}`
);

if (!response.ok) {
  throw new Error(`Mapbox style request failed with ${response.status}`);
}

const style = await response.json();

for (const property of ["created", "modified", "owner", "id", "draft", "visibility"]) {
  delete style[property];
}

style.layers = style.layers.flatMap((layer) => {
  const id = layer.id;

  if (layer.type === "symbol") {
    const keepCountryLabel =
      id.includes("country-label") || id.includes("continent-label");

    if (!keepCountryLabel) {
      return [];
    }

    return [
      {
        ...layer,
        layout: {
          ...layer.layout,
          "text-field": [
            "coalesce",
            ["get", "name_vi"],
            ["get", "name"],
          ],
        },
      },
    ];
  }

  const shouldRemove =
    id.includes("admin-1-boundary") ||
    id.includes("contour") ||
    id.includes("hillshade") ||
    id.includes("road") ||
    id.includes("path") ||
    id.includes("trail");

  return shouldRemove ? [] : [layer];
});

const outputPath = path.join(projectRoot, "src", "data", "mapbox-outdoors-clean.json");
await writeFile(outputPath, `${JSON.stringify(style)}\n`, "utf8");

console.log(`Generated ${path.relative(projectRoot, outputPath)} with ${style.layers.length} layers.`);
