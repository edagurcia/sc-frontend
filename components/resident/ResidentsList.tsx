"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useResidents, useSearch } from "@/hooks";
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
import { ResidentRow } from "@/components/resident/ResidentRow";
import { Resident } from "@/actions/residents/getResidentsAction";
import { CommunityDashboardActions } from "./CommunityDashboardActions";

const ENTITY_KEY = "community-residents";

export const ResidentList = () => {
  const { data: residents = [], isLoading, error } = useResidents();
  const [filterText, setFilterText] = useState("");

  const currentPage = usePaginationStore(
    (state) => state.pages[ENTITY_KEY] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[ENTITY_KEY] ?? 10,
  );

  const { dataSet: filteredResidents } = useSearch({
    data: residents,
    text: filterText,
  });

  const totalItems = filteredResidents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const safePage = currentPage > totalPages ? 1 : currentPage;
  const paginatedResidents = filteredResidents.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const handleGeneratePayment = (resident: Resident) => {
    console.log("Generar pago para:", resident.fullName);
  };

  const handleViewDetails = (resident: Resident) => {
    console.log("Ver detalles del residente:", resident.fullName);
    // Aquí puedes abrir un modal o navegar al detalle del residente
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
        <span>Error al cargar los residentes: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Gestión de Residentes
          </h3>
          <p className="text-xs text-muted-foreground">
            Listado oficial de propiedades y residentes registrados.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            isLoading={isLoading}
            placeholder="Buscar por nombre, casa, teléfono..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Casa</TableHead>
              <TableHead>Residente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Cuota Mensual</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResidents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron residentes registrados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedResidents.map((resident) => (
                <ResidentRow
                  key={resident.id}
                  resident={resident}
                  actions={
                    <CommunityDashboardActions
                      resident={resident}
                      onGeneratePayment={handleGeneratePayment}
                      onViewDetails={handleViewDetails}
                    />
                  }
                />
              ))
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
