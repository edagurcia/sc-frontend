"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  MapPin,
  UserRound,
  Home,
  Phone,
  Mail,
  Save,
  X,
  Loader2,
  RotateCcw,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Resident } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResidentLocationFormProps {
  resident: Resident;
  polygonJson?: string | null;
  communityName?: string;
  onSave: (latitude: number | null, longitude: number | null) => Promise<void>;
  onCancel: () => void;
}

type LatLngTuple = [number, number];

const propertyIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:#2563eb;border:3px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9],
});

function isPointInsidePolygon(
  point: LatLngTuple,
  polygon: LatLngTuple[],
): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function parsePolygon(polygonJson?: string | null): LatLngTuple[] {
  if (!polygonJson) return [];
  try {
    const parsed: unknown = JSON.parse(polygonJson);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is [number, number] =>
          Array.isArray(item) &&
          item.length >= 2 &&
          typeof item[0] === "number" &&
          typeof item[1] === "number" &&
          Number.isFinite(item[0]) &&
          Number.isFinite(item[1]),
      )
      .map(([lat, lng]) => [lat, lng]);
  } catch {
    return [];
  }
}

export const ResidentLocationForm = ({
  resident,
  polygonJson,
  communityName,
  onSave,
  onCancel,
}: ResidentLocationFormProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonCoordsRef = useRef<LatLngTuple[]>([]);

  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initialLat =
    resident.latitude !== null && resident.latitude !== undefined
      ? Number(resident.latitude)
      : null;
  const initialLng =
    resident.longitude !== null && resident.longitude !== undefined
      ? Number(resident.longitude)
      : null;

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialLat !== null &&
      initialLng !== null &&
      !Number.isNaN(initialLat) &&
      !Number.isNaN(initialLng)
      ? { lat: initialLat, lng: initialLng }
      : null,
  );

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    const defaultCenter: LatLngTuple = [14.0723, -87.2072];
    const polygonCoords = parsePolygon(polygonJson);
    polygonCoordsRef.current = polygonCoords;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 16,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    markerRef.current = null;

    if (polygonCoords.length >= 3) {
      const polygonLayer = L.polygon(polygonCoords, {
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(map);

      map.fitBounds(polygonLayer.getBounds(), { padding: [35, 35] });
    }

    const placeMarker = (lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: propertyIcon,
          draggable: false,
        }).addTo(map);
      }

      markerRef.current
        .bindPopup(
          `<strong>${resident.fullName}</strong><br/>Casa: ${resident.houseNumber || "S/N"}`,
        )
        .openPopup();

      setCoords({ lat, lng });
    };

    if (
      initialLat !== null &&
      initialLng !== null &&
      !Number.isNaN(initialLat) &&
      !Number.isNaN(initialLng)
    ) {
      placeMarker(initialLat, initialLng);
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickedPoint: LatLngTuple = [e.latlng.lat, e.latlng.lng];

      if (polygonCoordsRef.current.length < 3) {
        toast.error("No hay un polígono de comunidad configurado.");
        return;
      }

      if (!isPointInsidePolygon(clickedPoint, polygonCoordsRef.current)) {
        toast.warning(
          "La ubicación debe colocarse dentro del polígono de la comunidad.",
        );
        return;
      }

      placeMarker(clickedPoint[0], clickedPoint[1]);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    isMounted,
    polygonJson,
    resident.fullName,
    resident.houseNumber,
    initialLat,
    initialLng,
  ]);

  const handleClearLocation = () => {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    setCoords(null);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      await onSave(coords ? coords.lat : null, coords ? coords.lng : null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1">
      <header className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm text-foreground">
              {resident.fullName}
            </span>
            <Badge variant="secondary" className="text-[11px] gap-1">
              <Home className="h-3 w-3" />
              Casa {resident.houseNumber || "S/N"}
            </Badge>
          </div>
          {communityName && (
            <span className="text-xs text-muted-foreground">
              Comunidad:{" "}
              <strong className="text-foreground">{communityName}</strong>
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1 border-t border-border/40">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {resident.address || "Sin dirección"}
            {resident.street ? ` • ${resident.street}` : ""}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {resident.phone || "Sin teléfono"}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            {resident.email || "Sin correo"}
          </span>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          Haz clic dentro del área azul para ubicar la propiedad.
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono bg-muted px-2.5 py-1 rounded-md text-foreground">
            {coords
              ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
              : "Sin coordenadas"}
          </span>
          {coords && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearLocation}
              disabled={isSaving}
              className="h-7 px-2 text-xs cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {!isMounted ? (
        <div className="flex h-80 w-full items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span>Cargando mapa...</span>
        </div>
      ) : (
        <div
          className={`relative h-80 w-full overflow-hidden rounded-xl border border-border ${
            isDark ? "dark-map" : ""
          }`}
        >
          <div
            ref={mapContainerRef}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="cursor-pointer"
        >
          <X className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleConfirmSave}
          disabled={isSaving}
          className="cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1.5" />
              Guardar Ubicación
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
