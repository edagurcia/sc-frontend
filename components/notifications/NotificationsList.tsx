"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
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
import { NotificationRow } from "./NotificationRow";
import { NotificationResponse } from "@/schemas/notification-schema";
import { NotificationCrudActions } from "./NotificationCrudActions";

interface NotificationsListProps {
  onMarkAsRead: (notification: NotificationResponse) => void;
  onDelete: (notification: NotificationResponse) => void;
}

export const NotificationsList = ({
  onMarkAsRead,
  onDelete,
}: NotificationsListProps) => {
  const { notifications, isLoading, error } = useNotifications();
  const [filterText, setFilterText] = useState("");

  const entityKey = "admin-notifications";
  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  const { dataSet: filteredNotifications } = useSearch({
    data: notifications,
    text: filterText,
  });

  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const safePage = currentPage > totalPages ? 1 : currentPage;
  const paginatedNotifications = filteredNotifications.slice(
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
        <span>Error al cargar las notificaciones: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Historial de Notificaciones
          </h3>
          <p className="text-xs text-muted-foreground">
            Listado de notificaciones enviadas y recibidas en la plataforma.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            isLoading={isLoading}
            placeholder="Buscar por título o mensaje..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Título / Tipo</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead className="w-32">Fecha</TableHead>
              <TableHead className="text-center w-28">Estado</TableHead>
              <TableHead className="text-right w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNotifications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron notificaciones registradas.
                </TableCell>
              </TableRow>
            ) : (
              paginatedNotifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  actions={
                    <NotificationCrudActions
                      notification={notification}
                      onMarkAsRead={() => onMarkAsRead(notification)}
                      onDelete={() => onDelete(notification)}
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
