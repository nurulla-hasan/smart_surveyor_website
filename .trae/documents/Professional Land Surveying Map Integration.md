## Land Surveying Map Implementation Plan

### 1. Center Crosshair Overlay
- CSS `fixed top-1/2 left-1/2` target icon.
- `pointer-events-none` to allow map interaction.

### 2. Survey Drawing Logic
- Use `useMap` hook to access Leaflet instance.
- Capture `map.getCenter()` on button click.
- State management for vertices: `const [points, setPoints] = useState<L.LatLng[]>([]);`

### 3. Real-time Area Calculation (Turf.js)
- Convert points to Turf Polygon.
- Calculate area in square meters.
- Conversion: `decimal = area / 40.47`, `sqft = area * 10.7639`.

### 4. UI Components
- **Top Bar**: Real-time area display.
- **Bottom Bar**: Undo, Reset, Save buttons.
- **Floating Action Button (FAB)**: Large "Add Point" button for thumb access.

### 5. GeoJSON Generation
- Create a FeatureCollection with properties: `name`, `calculatedAreaDecimal`, `calculatedAreaSqFt`, `timestamp`.