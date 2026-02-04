import { MapsView } from "@/components/maps/maps-view";
import { getBookings } from "@/services/bookings";
import { getMaps } from "@/services/maps";

export const dynamic = "force-dynamic";

export default async function MapsPage() {
  // Fetch data in parallel on the server
  const [bookingsRes, mapsRes] = await Promise.all([
    getBookings({ limit: "100" }), // Get more bookings if needed
    getMaps({ limit: "100" })      // Get initial maps
  ]);

  return (
    <MapsView 
      initialBookings={bookingsRes?.data?.bookings || []} 
      initialMaps={mapsRes?.data?.maps || []} 
    />
  );
}
