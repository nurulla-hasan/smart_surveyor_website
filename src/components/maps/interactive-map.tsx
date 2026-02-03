/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useTransition } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Modular Components
import { MapToolbar } from "./map-toolbar";
import { SavedMapsDrawer } from "./saved-maps-drawer";
import { MapGeoJSONLayer } from "./map-geojson-layer";
import { FlyToLocation, FitBounds } from "./map-effects";
import { MapSaveDialog } from "./map-dialogs";

import { saveMap as saveMapService } from "@/services/maps";
import { getBookings } from "@/services/bookings";
import { SearchableOption } from "@/components/ui/custom/searchable-select";
import { Booking } from "@/types/bookings";
import { MapData } from "@/types/maps";
import { useEffect } from "react";

interface InteractiveMapProps {
  initialBookings: Booking[];
  initialMaps: MapData[];
}

export default function InteractiveMap({ initialBookings, initialMaps }: InteractiveMapProps) {
  // State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [defaultCenter] = useState<[number, number]>([25.6279, 88.6332]); // Dinajpur
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.GeoJsonObject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [activeLayer, setActiveLayer] = useState<"satellite" | "street">("satellite");
  const [mapKey, setMapKey] = useState(0);
  
  // UI State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [mapName, setMapName] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<SearchableOption | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isPending, startTransition] = useTransition();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<L.Map>(null);

  // Handlers
  const handleLocateMe = (showToast = true) => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
          if (showToast) toast.success("আপনার অবস্থান পাওয়া গেছে");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoadingLocation(false);
          if (showToast) toast.error("আপনার অবস্থান পাওয়া যায়নি। অনুগ্রহ করে পারমিশন দিন।");
        }
      );
    } else {
      if (showToast) toast.error("আপনার ব্রাউজার জিওলোকেশন সাপোর্ট করে না।");
      setIsLoadingLocation(false);
    }
  };

  // Fetch bookings for dropdown
  useEffect(() => {
    if (bookings.length === 0) {
      const fetchBookings = async () => {
        const res = await getBookings();
        if (res?.success) {
          setBookings(res.data.bookings || []);
        }
      };
      fetchBookings();
    }

    // Auto-locate on load - silent
    handleLocateMe(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setGeoJsonData(json);
        setMapKey((prev) => prev + 1);
        
        const geoJsonLayer = L.geoJSON(json as GeoJSON.GeoJsonObject);
        if (geoJsonLayer.getLayers().length > 0) {
          setMapBounds(geoJsonLayer.getBounds());
        } else {
          toast.error("ফাইলে কোনো বৈধ ম্যাপ ডাটা পাওয়া যায়নি।");
        }
      } catch (error) {
        toast.error("অকার্যকর GeoJSON ফাইল।");
        console.error(error);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSearch = () => {
    if (!geoJsonData || !searchQuery) return;

    let foundFeature = null;
    const features = (geoJsonData as any).features || [geoJsonData];
    
    for (const feature of features) {
      const props = feature.properties;
      if (props) {
        if (
          String(props.dag_no || "").includes(searchQuery) ||
          String(props.plot_no || "").includes(searchQuery) ||
          String(props.name || "").toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          foundFeature = feature;
          break;
        }
      }
    }

    if (foundFeature) {
      const layer = L.geoJSON(foundFeature);
      setMapBounds(layer.getBounds());
    } else {
      toast.error("আপলোড করা ম্যাপে প্লটটি পাওয়া যায়নি।");
    }
  };

  const handleLoadMap = (data: any) => {
    setGeoJsonData(data);
    setMapKey((prev) => prev + 1);
    const layer = L.geoJSON(data);
    if (layer.getLayers().length > 0) {
      setMapBounds(layer.getBounds());
    }
    setIsDrawerOpen(false);
  };

  const handleSaveMap = async () => {
    if (!geoJsonData || !mapName) return;
    
    startTransition(async () => {
      try {
        const res = await saveMapService({
          name: mapName,
          data: geoJsonData,
          bookingId: (selectedBooking?.value === "none" ? null : selectedBooking?.value) || null,
        });
        
        if (res?.success) {
          toast.success("ম্যাপ সফলভাবে সেভ করা হয়েছে!");
          setIsSaveDialogOpen(false);
          setMapName("");
          setSelectedBooking(null);
        } else {
          toast.error("ম্যাপ সেভ করতে সমস্যা হয়েছে");
        }
      } catch {
        toast.error("সার্ভার এরর");
      }
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col">
      <MapToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onSavedMapsClick={() => setIsDrawerOpen(true)}
        onMyLocationClick={handleLocateMe}
        onUploadClick={() => fileInputRef.current?.click()}
        onLayerToggle={() => setActiveLayer(prev => prev === "satellite" ? "street" : "satellite")}
        isLoadingLocation={isLoadingLocation}
      />

      <input
        type="file"
        accept=".json,.geojson"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      <SavedMapsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLoadMap={handleLoadMap}
        initialMaps={initialMaps}
      />

      <MapSaveDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        mapName={mapName}
        setMapName={setMapName}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        bookings={bookings}
        onSave={handleSaveMap}
        isPending={isPending}
      />

      <div className="flex-1 relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={userLocation ? 15 : 13}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          zoomControl={false}
          maxZoom={22}
        >
          <TileLayer
            attribution={activeLayer === "satellite" ? "&copy; Google Maps" : "&copy; OpenStreetMap"}
            url={activeLayer === "satellite" 
              ? "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            maxZoom={22}
            maxNativeZoom={activeLayer === "satellite" ? 20 : 19}
          />

          {userLocation && (
            <>
              <Marker position={userLocation}>
                <Popup>আপনি এখানে আছেন</Popup>
              </Marker>
              <FlyToLocation location={userLocation} />
            </>
          )}

          {geoJsonData && (
            <MapGeoJSONLayer data={geoJsonData} mapKey={mapKey} />
          )}
          
          <FitBounds bounds={mapBounds} />
        </MapContainer>
      </div>

      {/* Save Button for uploaded map */}
      {geoJsonData && (
        <div className="absolute bottom-6 right-18 z-20">
          <Button
            size="lg"
            onClick={() => setIsSaveDialogOpen(true)}
          >
            ম্যাপটি সেভ করুন
          </Button>
        </div>
      )}
    </div>
  );
}
