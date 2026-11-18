"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CommunityResponse } from "@/schemas/community-schema";
import { MapPin, Loader2 } from "lucide-react";
import L from "leaflet";

interface CommunitiesOverviewMapProps {
  communities: CommunityResponse[];
}

export const CommunitiesOverviewMap = ({
  communities,
}: CommunitiesOverviewMapProps) => {
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
      const defaultCenter: [number, number] = [14.0721, -87.1921]; // Tegucigalpa

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // 2. Limpiar capas de polígonos anteriores antes de volver a pintar
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        map.removeLayer(layer);
      }
    });

    // 3. Agregar polígonos dinámicamente
    communities.forEach((comm) => {
      if (!comm.polygon) return;
      try {
        const parsed = JSON.parse(comm.polygon);
        if (!Array.isArray(parsed) || parsed.length === 0) return;

        const polygonColor = comm.isActive ? "#2563eb" : "#9ca3af";
        const fillColor = comm.isActive ? "#3b82f6" : "#d1d5db";

        const polygon = L.polygon(parsed, {
          color: polygonColor,
          fillColor: fillColor,
          fillOpacity: 0.35,
          weight: 2,
        }).addTo(map);

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 180px;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 4px; color: inherit;">
              ${comm.name}
            </div>
            <div style="color: #64748b; margin-bottom: 6px;">
              ${comm.municipality}, ${comm.department}
            </div>
            ${
              comm.adminName || comm.adminEmail
                ? `<div style="background: rgba(0,0,0,0.04); padding: 4px 6px; border-radius: 4px; margin-bottom: 6px;">
                     <span style="font-size: 10px; font-weight: 500; color: #64748b; display: block;">ADMIN</span>
                     <strong>${comm.adminName || "Sin asignar"}</strong><br/>
                     <span style="color: #2563eb;">${comm.adminEmail || ""}</span>
                   </div>`
                : ""
            }
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.1); pt-4px;">
              <span>Total residentes:</span>
              <strong>${comm.residentsCount || 0}</strong>
            </div>
          </div>
        `;

        polygon.bindPopup(popupContent);
      } catch {
        // Ignorar JSON malformados
      }
    });

    // 4. Cleanup al desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMounted, communities]);

  if (!isMounted) {
    return (
      <div className="flex h-105 w-full items-center justify-center rounded-2xl border border-border/60 bg-card text-muted-foreground gap-2 shadow-2xs">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span>Cargando mapa general...</span>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Mapa General de Cobertura
        </h3>
        <p className="text-xs text-muted-foreground">
          Visualización de todas las comunidades y sus polígonos territoriales
          activos.
        </p>
      </div>

      <div
        className={`relative h-105 w-full overflow-hidden rounded-2xl border border-border/60 shadow-sm ${
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
};

export default CommunitiesOverviewMap;
