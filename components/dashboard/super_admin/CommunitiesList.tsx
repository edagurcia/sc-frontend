"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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

interface CommunitiesListProps {
  communities: CommunityResponse[];
  isLoading: boolean;
  onViewResidents: (community: CommunityResponse) => void;
  onToggleStatus: (community: CommunityResponse) => void;
  onViewMap: (community: CommunityResponse) => void;
}

const ENTITY_KEY = "super-admin-communities";

export const CommunitiesList = ({
  communities,
  isLoading,
  onViewResidents,
  onToggleStatus,
  onViewMap,
}: CommunitiesListProps) => {
  const [filterText, setFilterText] = useState("");

  const currentPage = usePaginationStore(
    (state) => state.pages[ENTITY_KEY] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[ENTITY_KEY] ?? 10,
  );

  const { dataSet: filteredCommunities } = useSearch({
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
            placeholder="Buscar por nombre, dirección, municipio..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comunidad</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className="text-center">Residentes</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCommunities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
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
                    onViewResidents={() => onViewResidents(community)}
                    onToggleStatus={() => onToggleStatus(community)}
                  />
                );

                return (
                  <CommunityRow
                    key={community.id}
                    community={community}
                    actions={actionsNode}
                  />
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          entityKey={ENTITY_KEY}
          totalPages={totalPages}
          totalItems={totalItems}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
