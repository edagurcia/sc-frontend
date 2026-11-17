"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
// @ts-ignore
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { Hexagon, Trash2 } from "lucide-react";

// Configuración de iconos por defecto de Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

try {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src || markerIcon2x,
    iconUrl: markerIcon.src || markerIcon,
    shadowUrl: markerShadow.src || markerShadow,
  });
} catch {}

type Coordinate = [number, number];

interface CommunityMapPolygonProps {
  value?: string;
  onChange: (polygonJson: string) => void;
}

const GeomanDrawController = ({
  value,
  onChange,
  activeLayerRef,
}: {
  value?: string;
  onChange: (val: string) => void;
  activeLayerRef: React.MutableRefObject<L.Polygon | null>;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    (map as any).pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: false,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });

    const extractCoordinates = (polygon: L.Polygon): Coordinate[] => {
      const latLngsObj = polygon.getLatLngs() as any;
      const firstRing = Array.isArray(latLngsObj[0])
        ? latLngsObj[0]
        : latLngsObj;
      return firstRing.map((ll: any) => [ll.lat, ll.lng] as Coordinate);
    };

    // Cargar polígono inicial si existe en el formulario (modo edición)
    if (value && !activeLayerRef.current) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const latLngs = parsed.map((pt: any) => L.latLng(pt[0], pt[1]));
          const existingPolygon = L.polygon(latLngs, {
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.35,
          }).addTo(map);

          activeLayerRef.current = existingPolygon;
          map.fitBounds(existingPolygon.getBounds(), { padding: [40, 40] });

          existingPolygon.on("pm:edit", () => {
            const coords = extractCoordinates(existingPolygon);
            onChange(JSON.stringify(coords));
          });
        }
      } catch (e) {
        console.error("Error al parsear el polígono inicial:", e);
      }
    }

    const updateCoordinatesFromLayer = (layer: any) => {
      if (layer instanceof L.Polygon) {
        activeLayerRef.current = layer;
        const coords = extractCoordinates(layer);
        onChange(JSON.stringify(coords));
      }
    };

    const handleCreate = (e: any) => {
      const { shape, layer } = e;
      if (shape === "Polygon" || shape === "Rectangle") {
        // Remover cualquier capa anterior antes de fijar la nueva
        map.eachLayer((l: any) => {
          if (
            l !== layer &&
            l instanceof L.Polygon &&
            !(l instanceof L.TileLayer)
          ) {
            map.removeLayer(l);
          }
        });

        updateCoordinatesFromLayer(layer);

        layer.on("pm:edit", () => updateCoordinatesFromLayer(layer));
        layer.on("pm:dragend", () => updateCoordinatesFromLayer(layer));
      }
    };

    const handleRemove = (e: any) => {
      if (
        e.layer === activeLayerRef.current ||
        e.shape === "Polygon" ||
        e.shape === "Rectangle"
      ) {
        activeLayerRef.current = null;
        onChange("");
      }
    };

    map.on("pm:create", handleCreate);
    map.on("pm:remove", handleRemove);

    return () => {
      try {
        (map as any).pm.removeControls();
      } catch {}
      map.off("pm:create", handleCreate);
      map.off("pm:remove", handleRemove);
    };
  }, [map]);

  return null;
};

export const CommunityMapPolygon = ({
  value,
  onChange,
}: CommunityMapPolygonProps) => {
  const defaultCenter: Coordinate = [14.0721, -87.1921]; // Tegucigalpa
  const activeLayerRef = useRef<L.Polygon | null>(null);
  const hasPolygon = Boolean(value && value.length > 2);

  const handleClearAll = () => {
    // Si hay una capa activa en el mapa, la eliminamos visualmente
    if (activeLayerRef.current) {
      activeLayerRef.current.remove();
      activeLayerRef.current = null;
    }
    // Limpiamos el valor en el formulario
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">
          Delimitación Geográfica de la Comunidad:
        </span>
        <span className="text-[11px] text-muted-foreground">
          Usa las herramientas en la esquina superior izquierda del mapa para
          dibujar o editar el polígono de la zona.
        </span>
      </div>

      <div className="h-80 w-full rounded-xl overflow-hidden border border-border/60 relative z-0 shadow-inner">
        <MapContainer
          center={defaultCenter}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeomanDrawController
            value={value}
            onChange={onChange}
            activeLayerRef={activeLayerRef}
          />
        </MapContainer>
      </div>

      {/* Cuadro de estado y vista previa de coordenadas */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/60 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <Hexagon
            className={`h-4 w-4 shrink-0 ${hasPolygon ? "text-emerald-600" : "text-muted-foreground"}`}
          />
          <div className="flex flex-col truncate">
            <span className="font-medium text-foreground">
              {hasPolygon
                ? "Polígono activo registrado"
                : "Sin polígono definido"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground truncate">
              {hasPolygon
                ? value
                : "Dibuja un rectángulo o polígono en el mapa"}
            </span>
          </div>
        </div>

        {hasPolygon && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-destructive hover:text-destructive/80 text-[11px] font-medium flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
