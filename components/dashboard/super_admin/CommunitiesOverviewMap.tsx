"use client";

import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CommunityResponse } from "@/schemas/community-schema";

interface Props {
  communities: CommunityResponse[];
}

export const CommunitiesOverviewMap = ({ communities }: Props) => {
  const defaultCenter: [number, number] = [14.0721, -87.1921]; // Tegucigalpa

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-foreground">
          Mapa General de Cobertura
        </h3>
        <p className="text-xs text-muted-foreground">
          Visualización de todas las comunidades y sus polígonos territoriales
          activos.
        </p>
      </div>

      <div className="h-105 w-full rounded-2xl overflow-hidden border border-border/60 relative z-0 shadow-sm">
        <MapContainer
          center={defaultCenter}
          zoom={15}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {communities.map((comm) => {
            if (!comm.polygon) return null;
            try {
              const parsed = JSON.parse(comm.polygon);
              if (!Array.isArray(parsed) || parsed.length === 0) return null;

              return (
                <Polygon
                  key={comm.id}
                  positions={parsed}
                  pathOptions={{
                    color: comm.isActive ? "#2563eb" : "#9ca3af",
                    fillColor: comm.isActive ? "#3b82f6" : "#d1d5db",
                    fillOpacity: 0.35,
                    weight: 2,
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 min-w-50 text-xs space-y-2 bg-card text-card-foreground">
                      {/* Cabecera Comunidad */}
                      <div className="space-y-0.5 border-b border-border pb-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-foreground truncate">
                            {comm.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                              comm.isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {comm.isActive ? "Activa" : "Inactiva"}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] truncate">
                          {comm.municipality}, {comm.department}
                        </p>
                      </div>

                      {/* Administrador (Compacto en línea) */}
                      {(comm.adminName || comm.adminEmail) && (
                        <div className="bg-muted/50 rounded-lg p-1.5 space-y-0.5 border border-border/40">
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block">
                            Admin
                          </span>
                          <p className="font-medium text-foreground truncate">
                            {comm.adminName || "Sin asignar"}
                          </p>
                          {comm.adminEmail && (
                            <p className="text-[11px] text-blue-600 dark:text-blue-400 truncate">
                              {comm.adminEmail}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Estadísticas de Residentes */}
                      <div className="flex items-center justify-between pt-0.5 text-muted-foreground text-[11px]">
                        <span>Total residentes:</span>
                        <span className="font-semibold text-foreground font-mono text-xs">
                          {comm.residentsCount || 0}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            } catch {
              return null;
            }
          })}
        </MapContainer>
      </div>
    </div>
  );
};
