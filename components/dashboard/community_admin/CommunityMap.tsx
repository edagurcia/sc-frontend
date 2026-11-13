"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CommunityMapResponse } from "@/actions/dashboard/getCommunityMapAction";
import { MapPin, Home, Phone, User, Layers } from "lucide-react";
import L from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface CommunityMapProps {
  data: CommunityMapResponse;
}

export const CommunityMap = ({ data }: CommunityMapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Solución para evitar que Leaflet busque los iconos predeterminados inexistentes (404)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-2xl border bg-card text-muted-foreground">
        Cargando mapa interactivo...
      </div>
    );
  }

  const defaultCenter: [number, number] = [14.0723, -87.2072];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Mapa Geográfico - {data.community.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {data.community.address} ({data.community.municipality},{" "}
            {data.community.department})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-muted px-3 py-1.5 rounded-lg self-start">
          <Layers className="h-4 w-4 text-indigo-600" />
          <span>{data.residents.length} propiedades registradas</span>
        </div>
      </div>

      <div className="relative h-112.5 w-full overflow-hidden rounded-xl border border-border">
        <MapContainer
          center={defaultCenter}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {data.residents.map((resident, index) => {
            const latOffset = index * 0.001 - 0.004;
            const lngOffset = index * 0.001 - 0.004;
            const position: [number, number] = [
              defaultCenter[0] + latOffset,
              defaultCenter[1] + lngOffset,
            ];

            return (
              <Marker key={resident.id} position={position}>
                <Popup>
                  <div className="flex flex-col gap-1.5 p-1 text-xs max-w-50">
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Home className="h-4 w-4 text-emerald-600" />
                      Casa {resident.houseNumber || "S/N"}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{resident.fullName}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{resident.phone}</span>
                    </div>
                    <p className="text-[11px] italic bg-muted p-1 rounded mt-1">
                      Ref: {resident.reference || resident.address}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
