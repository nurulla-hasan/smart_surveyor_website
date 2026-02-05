"use client";

import { Polygon, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";

interface SurveyLayersProps {
  points: L.LatLng[];
}

export function SurveyLayers({ points }: SurveyLayersProps) {
  if (points.length === 0) return null;

  const positions = points.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <>
      {/* Visual connection between points */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#ffffff",
          weight: 2,
          dashArray: "5, 10",
          opacity: 0.8,
        }}
      />

      {/* Area Polygon - only visible if 3+ points */}
      {points.length >= 3 && (
        <Polygon
          positions={positions}
          pathOptions={{
            color: "#d8b4fe",
            fillColor: "#d8b4fe",
            fillOpacity: 0.3,
            weight: 3,
          }}
        />
      )}

      {/* Markers for each vertex */}
      {points.map((point, index) => (
        <CircleMarker
          key={`${index}-${point.lat}-${point.lng}`}
          center={[point.lat, point.lng]}
          radius={6}
          pathOptions={{
            fillColor: index === points.length - 1 ? "#ef4444" : "#ffffff",
            fillOpacity: 1,
            color: "#000000",
            weight: 2,
          }}
        />
      ))}
    </>
  );
}
