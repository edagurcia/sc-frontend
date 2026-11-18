"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { usePaginationStore } from "@/stores";
import { useSearch } from "@/hooks";
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
import { AnnouncementRow } from "./AnnouncementRow";
import { AnnouncementResponse } from "@/schemas/announcement-schema";
import { AnnouncementCrudActions } from "./AnnouncementCrudActions";

interface AnnouncementsListProps {
  onEdit: (announcement: AnnouncementResponse) => void;
  onToggleStatus: (announcement: AnnouncementResponse) => void;
}

export const AnnouncementsList = ({
  onEdit,
  onToggleStatus,
}: AnnouncementsListProps) => {
  const { announcements, isLoading, error } = useAnnouncements();
  const [filterText, setFilterText] = useState("");

  const entityKey = "admin-announcements";
  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  const { dataSet: filteredAnnouncements } = useSearch({
    data: announcements,
    text: filterText,
  });

  const totalItems = filteredAnnouncements.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const safePage = currentPage > totalPages ? 1 : currentPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(
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

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-destructive flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>Error al cargar los anuncios: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Gestión de Anuncios
          </h3>
          <p className="text-xs text-muted-foreground">
            Listado general de avisos publicados para la comunidad.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            isLoading={isLoading}
            placeholder="Buscar por título o contenido..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Título</TableHead>
              <TableHead>Contenido</TableHead>
              <TableHead className="w-32">Fecha</TableHead>
              <TableHead className="text-center w-28">Estado</TableHead>
              <TableHead className="text-right w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAnnouncements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron anuncios registrados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAnnouncements.map((announcement) => (
                <AnnouncementRow
                  key={announcement.id}
                  announcement={announcement}
                  actions={
                    <AnnouncementCrudActions
                      announcement={announcement}
                      onEdit={() => onEdit(announcement)}
                      onToggleStatus={() => onToggleStatus(announcement)}
                    />
                  }
                />
              ))
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
    </div>
  );
};
