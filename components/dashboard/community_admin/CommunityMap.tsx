"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CommunityMapResponse } from "@/actions/dashboard/getCommunityMapAction";
import { Home, Phone, User, Layers, MapPin, Loader2 } from "lucide-react";
import L from "leaflet";

interface CommunityMapProps {
  data: CommunityMapResponse;
}

export function CommunityMap({ data }: CommunityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    // 1. Inicializar el mapa nativo si no existe
    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = [14.0723, -87.2072];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // 2. Limpiar marcadores anteriores antes de volver a pintar
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // 3. Configurar iconos de Leaflet
    const defaultIcon = L.icon({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const defaultCenter: [number, number] = [14.0723, -87.2072];

    // 4. Agregar marcadores dinámicamente
    data.residents.forEach((resident, index) => {
      const latOffset = index * 0.001 - 0.004;
      const lngOffset = index * 0.001 - 0.004;
      const lat = defaultCenter[0] + latOffset;
      const lng = defaultCenter[1] + lngOffset;

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong>Casa ${resident.houseNumber || "S/N"}</strong><br/>
          👤 ${resident.fullName}<br/>
          📞 ${resident.phone}<br/>
          <em>Ref: ${resident.reference || resident.address}</em>
        </div>
      `;

      L.marker([lat, lng], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    // 5. Cleanup al desmontar o actualizar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMounted, data]);

  if (!isMounted) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-2xl border border-border/60 bg-card text-muted-foreground gap-2 shadow-2xs">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span>Cargando mapa interactivo...</span>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Mapa Geográfico - {data.community.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {data.community.address} ({data.community.municipality},{" "}
            {data.community.department})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-muted px-3 py-1.5 rounded-lg self-start text-foreground">
          <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>{data.residents.length} propiedades registradas</span>
        </div>
      </div>

      <div
        className={`relative h-112.5 w-full overflow-hidden rounded-xl border border-border ${isDark ? "dark-map" : ""}`}
      >
        <div
          ref={mapContainerRef}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        />
      </div>
    </div>
  );
}

export default CommunityMap;
