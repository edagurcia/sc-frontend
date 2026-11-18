"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CommunityMapResponse } from "@/actions/dashboard/getCommunityMapAction";
import { MapPin, Building2, Loader2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

    const defaultCenter: [number, number] = [14.0723, -87.2072];

    // 1. Inicializar el mapa nativo si no existe
    if (!mapInstanceRef.current) {
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

    // 2. Limpiar capas anteriores (polígonos o marcadores)
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const community = data.community;

    // 3. Renderizar el polígono de la comunidad si existe
    if (community?.polygon) {
      try {
        const parsedPolygon = JSON.parse(community.polygon);
        if (Array.isArray(parsedPolygon) && parsedPolygon.length > 0) {
          const polygonLayer = L.polygon(parsedPolygon, {
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.35,
            weight: 2,
          }).addTo(map);

          const popupContent = `
            <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 160px;">
              <strong>${community.name}</strong><br/>
              <span style="color: #64748b;">${community.municipality}, ${community.department}</span>
            </div>
          `;

          polygonLayer.bindPopup(popupContent);

          // Centrar automáticamente el mapa en el polígono de la comunidad
          map.fitBounds(polygonLayer.getBounds(), { padding: [50, 50] });
        }
      } catch (error) {
        console.error("Error al parsear el polígono de la comunidad:", error);
      }
    }

    // 4. Cleanup al desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMounted, data]);

  if (!isMounted) {
    return (
      <div className="flex h-105 w-full items-center justify-center rounded-2xl border border-border/60 bg-card text-muted-foreground gap-2 shadow-2xs">
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
            Polígono Territorial - {data.community.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {data.community.address} ({data.community.municipality},{" "}
            {data.community.department})
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-muted px-3 py-1.5 rounded-lg self-start text-foreground">
          <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Delimitación oficial activa</span>
        </div>
      </div>

      <div
        className={`relative h-105 w-full overflow-hidden rounded-xl border border-border ${
          isDark ? "dark-map" : ""
        }`}
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
