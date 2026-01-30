"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import { toast } from "sonner";

// Modular Components
import { SurveyCrosshair } from "./survey-crosshair";
import { SurveyLayers } from "./survey-layers";
import { SurveyControls } from "./survey-controls";
import { MapSaveDialog } from "./map-dialogs";
import { FlyToLocation } from "./map-effects";
import { saveMap as saveMapService } from "@/services/maps";
import { getBookings } from "@/services/bookings";
import { SearchableOption } from "@/components/ui/custom/searchable-select";
import { Booking } from "@/types/bookings";
import * as turf from "@turf/turf";

// Internal helper component to get map instance
function MapReference({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    if (map) onReady(map);
  }, [map, onReady]);
  return null;
}

export function SurveyorMap() {
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [mapName, setMapName] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<SearchableOption | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [currentStats, setCurrentStats] = useState<{ area: number; perimeter: number } | undefined>(undefined);
  const mapRef = useRef<L.Map | null>(null);

  // Fetch bookings for dropdown
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getBookings();
      if (res?.success) {
        setBookings(res.data.bookings || []);
      }
    };
    fetchBookings();
  }, []);

  // Handlers
  const calculateStats = useCallback((pts: L.LatLng[]) => {
    if (pts.length < 3) return undefined;
    const coords = [...pts, pts[0]].map((p) => [p.lng, p.lat]);
    const polygon = turf.polygon([coords]);
    const areaSqM = turf.area(polygon);
    const line = turf.lineString(coords);
    const perimeterM = turf.length(line, { units: "meters" });

    return {
      area: Number((areaSqM / 40.47).toFixed(3)),
      perimeter: Math.round(perimeterM),
    };
  }, []);

  const handleLocateMe = useCallback(() => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
          toast.success("আপনার অবস্থান পাওয়া গেছে");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoadingLocation(false);
          toast.error("আপনার অবস্থান পাওয়া যায়নি। অনুগ্রহ করে পারমিশন দিন।");
        }
      );
    } else {
      toast.error("আপনার ব্রাউজার জিওলোকেশন সাপোর্ট করে না।");
      setIsLoadingLocation(false);
    }
  }, []);

  const handleAddPoint = useCallback(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    setPoints((prev) => [...prev, center]);
    toast.success("পয়েন্ট যোগ করা হয়েছে");
  }, []);

  const handleUndo = useCallback(() => {
    setPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleReset = useCallback(() => {
    setPoints([]);
    toast.info("সব পয়েন্ট মুছে ফেলা হয়েছে");
  }, []);

  const handleSave = async () => {
    if (points.length < 3) return;
    const stats = calculateStats(points);
    setCurrentStats(stats);
    setIsSaveDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!mapName || points.length < 3 || !currentStats) return;

    setIsPending(true);
    try {
      // Create GeoJSON structure
      const coords = [...points, points[0]].map((p) => [p.lng, p.lat]);
      const polygon = turf.polygon([coords]);

      const geoJsonFeature = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: polygon.geometry,
            properties: {
              name: mapName,
              area: currentStats.area,
              perimeter: currentStats.perimeter,
              pointCount: points.length,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      };

      const res = await saveMapService({
        name: mapName,
        data: geoJsonFeature,
        area: currentStats.area,
        perimeter: currentStats.perimeter,
        bookingId: (selectedBooking?.value === "none" ? null : selectedBooking?.value) || null,
      });

      if (res?.success) {
        toast.success("জরিপ সফলভাবে সেভ করা হয়েছে!");
        setPoints([]);
        setIsSaveDialogOpen(false);
        setMapName("");
        setSelectedBooking(null);
        setCurrentStats(undefined);
      } else {
        toast.error("সেভ করতে সমস্যা হয়েছে"); 
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("সার্ভার এরর");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative h-full w-[calc(100%+2.5rem)] -m-5 overflow-hidden flex flex-col bg-black">
      {/* 1. The Map */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={18} // High zoom for surveying
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          maxZoom={22}
        >
          {/* High Resolution Satellite Layer */}
          <TileLayer
            attribution="&copy; Google Maps"
            url="https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
            maxZoom={22}
            maxNativeZoom={20}
          />

          <MapReference onReady={(map) => (mapRef.current = map)} />
          <SurveyLayers points={points} />

          {userLocation && (
            <>
              <Marker position={userLocation}>
                <Popup>আপনি এখানে আছেন</Popup>
              </Marker>
              <FlyToLocation location={userLocation} />
            </>
          )}
        </MapContainer>
      </div>

      {/* 2. Fixed Center Crosshair */}
      <SurveyCrosshair />

      {/* 3. Floating Controls */}
      <SurveyControls
        points={points}
        onAddPoint={handleAddPoint}
        onUndo={handleUndo}
        onReset={handleReset}
        onSave={handleSave}
        onMyLocation={handleLocateMe}
        isLoadingLocation={isLoadingLocation}
        isPending={isPending}
      />

      {/* 4. Save Dialog */}
      <MapSaveDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        mapName={mapName}
        setMapName={setMapName}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        bookings={bookings}
        onSave={handleConfirmSave}
        isPending={isPending}
        stats={currentStats}
      />
    </div>
  );
}
