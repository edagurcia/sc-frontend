"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useSearch } from "@/hooks";
import { usePaginationStore } from "@/stores";
import { TablePagination } from "@/components/TablePagination";
import { SearchComponent } from "@/components/SearchComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommunityResponse } from "@/schemas/community-schema";
import { CommunityRow } from "./CommunityRow";
import { CommunityCrudActions } from "./CommunityCrudActions";
import { CommunityResidentsModal } from "@/components/dashboard/super_admin/CommunityResidentsModal";

interface CommunitiesListProps {
  communities: CommunityResponse[];
  isLoading: boolean;
  error?: Error | null;
  onEdit?: (community: CommunityResponse) => void;
  onToggleStatus?: (community: CommunityResponse) => void;
  entityKey?: string;
}

export const CommunitiesList = ({
  communities = [],
  isLoading,
  error,
  onEdit,
  onToggleStatus,
  entityKey = "super-admin-communities",
}: CommunitiesListProps) => {
  const [filterText, setFilterText] = useState("");

  // Estado para controlar el modal de residentes de una comunidad seleccionada
  const [selectedCommunityForResidents, setSelectedCommunityForResidents] =
    useState<CommunityResponse | null>(null);
  const [isResidentsModalOpen, setIsResidentsModalOpen] = useState(false);

  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  // Tipado estricto para evitar 'unknown' con useSearch
  const { dataSet: filteredCommunities } = useSearch<CommunityResponse>({
    data: communities,
    text: filterText,
  });

  const totalItems = filteredCommunities.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const safePage = currentPage > totalPages ? 1 : currentPage;
  const paginatedCommunities = filteredCommunities.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const handleOpenResidentsModal = (community: CommunityResponse) => {
    setSelectedCommunityForResidents(community);
    setIsResidentsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>Error al cargar las comunidades: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Gestión de Comunidades SaaS
          </h3>
          <p className="text-xs text-muted-foreground">
            Listado oficial de comunidades registradas en la plataforma.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            isLoading={isLoading}
            placeholder="Buscar por nombre, dirección..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comunidad</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead className="text-center">Residentes</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCommunities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron comunidades registradas.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCommunities.map((community) => {
                const actionsNode = (
                  <CommunityCrudActions
                    community={community}
                    onEdit={() => onEdit?.(community)}
                    onToggleStatus={() => onToggleStatus?.(community)}
                  />
                );

                return (
                  <CommunityRow
                    key={community.id}
                    community={community}
                    actions={actionsNode}
                    onOpenResidents={() => handleOpenResidentsModal(community)}
                  />
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          entityKey={entityKey}
          totalPages={totalPages}
          totalItems={totalItems}
          isLoading={isLoading}
        />
      </div>

      {/* Modal global de residentes controlado por la fila seleccionada */}
      <CommunityResidentsModal
        community={selectedCommunityForResidents}
        open={isResidentsModalOpen}
        onOpenChange={setIsResidentsModalOpen}
      />
    </div>
  );
};
