/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useTransition } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import { toast } from "sonner";

// Modular Components
import { MapToolbar } from "./map-toolbar";
import { SavedMapsDrawer } from "./saved-maps-drawer";
import { MapGeoJSONLayer } from "./map-geojson-layer";
import { FlyToLocation, FitBounds } from "./map-effects";
import { MapSaveDialog, MapDeleteDialog } from "./map-dialogs";

export default function InteractiveMap() {
  // State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.GeoJsonObject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [activeLayer, setActiveLayer] = useState<"satellite" | "street">("satellite");
  const [mapKey, setMapKey] = useState(0);
  
  // UI State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [mapToDelete, setMapToDelete] = useState<string | null>(null);
  const [mapName, setMapName] = useState("");
  const [isPending, startTransition] = useTransition();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<L.Map>(null);

  // Handlers
  const handleLocateMe = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
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
  };

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

  const handleSaveMap = () => {
    // TODO: Implement actual save action
    startTransition(() => {
      console.log("Saving map:", mapName);
      toast.success("ম্যাপ সফলভাবে সেভ করা হয়েছে!");
      setIsSaveDialogOpen(false);
      setMapName("");
    });
  };

  const handleDeleteMap = () => {
    // TODO: Implement actual delete action
    startTransition(() => {
      console.log("Deleting map:", mapToDelete);
      toast.success("ম্যাপ সফলভাবে মোছা হয়েছে!");
      setIsDeleteDialogOpen(false);
      setMapToDelete(null);
    });
  };

  return (
    <div className="relative h-full w-[calc(100%+2.5rem)] overflow-hidden flex flex-col">
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
        savedMaps={[]} // TODO: Pass actual saved maps
        onLoadMap={handleLoadMap}
        onDeleteMap={(id) => {
          setMapToDelete(id);
          setIsDeleteDialogOpen(true);
        }}
      />

      <MapSaveDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        mapName={mapName}
        setMapName={setMapName}
        onSave={handleSaveMap}
        isPending={isPending}
      />

      <MapDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteMap}
        isPending={isPending}
      />

      <div className="flex-1 relative z-0">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            attribution={activeLayer === "satellite" ? "&copy; Google Maps" : "&copy; OpenStreetMap"}
            url={activeLayer === "satellite" 
              ? "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
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
        <div className="absolute bottom-6 right-20 z-1000">
          <button
            onClick={() => setIsSaveDialogOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full shadow-lg font-bold hover:opacity-90 transition-opacity"
          >
            ম্যাপটি সেভ করুন
          </button>
        </div>
      )}
    </div>
  );
}
