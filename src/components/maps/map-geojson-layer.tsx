/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GeoJSON } from "react-leaflet";
import L from "leaflet";

interface MapGeoJSONLayerProps {
  data: GeoJSON.GeoJsonObject;
  mapKey: number;
}

export function MapGeoJSONLayer({ data, mapKey }: MapGeoJSONLayerProps) {
  const geoJsonStyle = {
    color: "#d8b4fe", // Purple borders
    weight: 2,
    opacity: 1,
    fillColor: "transparent",
    fillOpacity: 0,
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties) {
      const props = feature.properties as Record<string, any>;
      const popupContent = `
        <div class="text-xs font-sans p-2">
            <div class="font-bold border-b border-border pb-1 mb-2 text-primary">প্লট তথ্য</div>
            <div class="space-y-1">
                ${Object.entries(props)
                  .map(
                    ([key, value]) =>
                      `<div><span class="font-semibold text-muted-foreground">${key}:</span> ${value}</div>`
                  )
                  .join("")}
            </div>
        </div>
      `;
      layer.bindPopup(popupContent);

      // Add tooltip labels
      const label = props.dag_no || props.plot_no || props.name || props.id;
      if (label) {
        layer.bindTooltip(String(label), {
          permanent: true,
          direction: "center",
          className: "custom-map-tooltip",
          opacity: 1,
        });
      }
    }
  };

  const pointToLayer = (feature: GeoJSON.Feature, latlng: L.LatLng) => {
    const props = (feature.properties || {}) as Record<string, any>;
    const label = props.name || props.dag_no || props.plot_no || props.id;

    if (label) {
      return L.marker(latlng, {
        icon: L.divIcon({
          className: "bg-transparent border-0",
          html: `<div style="color: white; font-weight: 900; font-size: 14px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 0px 4px #000; white-space: nowrap; transform: translate(-50%, -50%);">${label}</div>`,
          iconSize: [100, 20],
          iconAnchor: [50, 10],
        }),
      });
    }
    return L.circleMarker(latlng, {
      radius: 4,
      color: "#d8b4fe",
      fillColor: "#d8b4fe",
      fillOpacity: 1,
    });
  };

  return (
    <GeoJSON
      key={`geojson-${mapKey}`}
      data={data}
      style={geoJsonStyle}
      onEachFeature={onEachFeature}
      pointToLayer={pointToLayer}
    />
  );
}
