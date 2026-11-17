"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Home, Phone, Droplets, Users } from "lucide-react";
import { useSearch } from "@/hooks";
import { SearchComponent } from "@/components/SearchComponent";
import { CommunityResponse } from "@/schemas/community-schema";
import {
  getCommunityMapDetailsAction,
  ResidentItem,
} from "@/actions/dashboard/getCommunityMapDetailsAction";

interface CommunityResidentsModalProps {
  community: CommunityResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommunityResidentsModal = ({
  community,
  open,
  onOpenChange,
}: CommunityResidentsModalProps) => {
  const [filterText, setFilterText] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["superadmin-community-detail", community?.id],
    queryFn: async () => {
      if (!community?.id) return null;
      const result = await getCommunityMapDetailsAction(community.id);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Error al cargar los residentes");
      }
      return result.data;
    },
    enabled: open && Boolean(community?.id),
  });

  const residents = data?.residents || [];

  // Tipado explícito con ResidentItem para evitar 'unknown'
  const { dataSet: filteredResidents } = useSearch<ResidentItem>({
    data: residents,
    text: filterText,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader className="space-y-3">
          <div>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Residentes de {community?.name}
            </DialogTitle>
            <DialogDescription className="mt-1">
              {community?.municipality}, {community?.department} — Total
              registrados:{" "}
              <span className="font-semibold text-foreground">
                {residents.length}
              </span>
            </DialogDescription>
          </div>

          {residents.length > 0 && (
            <div className="pt-1">
              <SearchComponent
                filterText={filterText}
                setFilterText={setFilterText}
                isLoading={isLoading}
                placeholder="Buscar por nombre, casa, teléfono, calle..."
              />
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 mt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs">
                Cargando directorio de residentes...
              </span>
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-sm text-destructive">
              Error al obtener el listado de residentes. Verifica la conexión
              con el servidor.
            </div>
          ) : residents.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-xl">
              Esta comunidad aún no tiene residentes registrados.
            </div>
          ) : filteredResidents.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-xl">
              No se encontraron residentes que coincidan con &quot;{filterText}
              &quot;.
            </div>
          ) : (
            <div className="divide-y divide-border/60 border rounded-xl overflow-hidden">
              {filteredResidents.map((resident: ResidentItem) => (
                <div
                  key={resident.id}
                  className="p-3.5 bg-card hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {resident.fullName}
                      </span>
                      <Badge
                        variant={resident.isActive ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {resident.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Home className="h-3.5 w-3.5 text-foreground/70" />
                        {resident.houseNumber
                          ? `Casa #${resident.houseNumber}`
                          : "Sin # casa"}
                        {resident.street ? ` • Calle ${resident.street}` : ""}
                        {resident.avenue ? ` • Av. ${resident.avenue}` : ""}
                      </span>

                      {resident.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-foreground/70" />
                          {resident.phone}
                        </span>
                      )}
                    </div>

                    {resident.reference && (
                      <p className="text-[11px] text-muted-foreground/85 italic">
                        Ref: {resident.reference}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {resident.hasCistern && (
                      <Badge
                        variant="outline"
                        className="text-[10px] gap-1 text-blue-600 border-blue-200 bg-blue-50/50 dark:bg-blue-950/40 dark:border-blue-800"
                      >
                        <Droplets className="h-3 w-3" /> Cisterna
                      </Badge>
                    )}
                    {resident.floorsCount && (
                      <Badge variant="outline" className="text-[10px]">
                        {resident.floorsCount}{" "}
                        {resident.floorsCount === 1 ? "nivel" : "niveles"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
