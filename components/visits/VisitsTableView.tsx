"use client";

import { useMemo, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useVisits } from "@/hooks/useVisits";
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
import { VisitRow } from "./VisitRow";
import { VisitDetailAction } from "./VisitDetailAction";
import { VisitResponse } from "@/schemas/visit-schema";

interface VisitsTableViewProps {
  onViewDetail: (visit: VisitResponse) => void;
}

export const VisitsTableView = ({ onViewDetail }: VisitsTableViewProps) => {
  const { visits, isLoading, error } = useVisits();
  const [filterText, setFilterText] = useState("");

  const entityKey = "resident-visits-table";
  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  const sortedVisits = useMemo(() => {
    return [...visits].sort((a, b) => {
      const aFreq = a.isFrequent ? 1 : 0;
      const bFreq = b.isFrequent ? 1 : 0;
      if (aFreq !== bFreq) return bFreq - aFreq;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [visits]);

  const { dataSet: filteredVisits } = useSearch({
    data: sortedVisits,
    text: filterText,
  });

  const totalItems = filteredVisits.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedVisits = filteredVisits.slice(
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
        <span>Error al cargar las visitas: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Directorio de Visitas
          </h3>
          <p className="text-xs text-muted-foreground">
            Visitas frecuentes primero, seguidas de visitas casuales.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            isLoading={isLoading}
            placeholder="Buscar por nombre, empresa, placa o código..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitante / Empresa</TableHead>
              <TableHead className="w-32">Tipo</TableHead>
              <TableHead className="w-32">Código</TableHead>
              <TableHead className="text-center w-28">Estado</TableHead>
              <TableHead className="text-right w-32">Detalle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVisits.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron visitas registradas.
                </TableCell>
              </TableRow>
            ) : (
              paginatedVisits.map((visit) => (
                <VisitRow
                  key={visit.id}
                  visit={visit}
                  actions={
                    <VisitDetailAction
                      visit={visit}
                      onViewDetail={onViewDetail}
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
