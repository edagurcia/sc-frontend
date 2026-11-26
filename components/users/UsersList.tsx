"use client";

import { useMemo, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
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
import { User } from "@/schemas/user-schema";
import { UserActions, UserRow } from "./UserRow";

interface UsersListProps {
  communityMap?: Record<string, string>;
  entityKey?: string;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onResetPassword?: (user: User) => void;
}

export const UsersList = ({
  communityMap = {},
  entityKey = "admin-users",
  onEdit,
  onToggleStatus,
  onResetPassword,
}: UsersListProps) => {
  const { data: users = [], isLoading, error } = useUsers();
  const [filterText, setFilterText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [communityFilter, setCommunityFilter] = useState<string>("all");

  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  const resolveCommunityName = (user: User) => {
    if (!user.communityId) {
      return user.role === "super_admin"
        ? "Acceso global (Plataforma)"
        : "Sin comunidad asignada";
    }
    return communityMap[user.communityId] ?? user.communityId;
  };

  const communityOptions = useMemo(() => {
    const ids = Array.from(
      new Set(
        users
          .map((u) => u.communityId)
          .filter((id): id is string => Boolean(id)),
      ),
    );
    return ids.map((id) => ({
      id,
      name: communityMap[id] ?? id,
    }));
  }, [users, communityMap]);

  const filteredUsers = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesCommunity =
        communityFilter === "all" ||
        (communityFilter === "none" && !user.communityId) ||
        user.communityId === communityFilter;
      const communityName = resolveCommunityName(user).toLowerCase();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        communityName.includes(q) ||
        (user.communityId ?? "").toLowerCase().includes(q);
      return matchesRole && matchesCommunity && matchesSearch;
    });
  }, [users, filterText, roleFilter, communityFilter, communityMap]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safePage = currentPage > totalPages ? 1 : currentPage;
  const paginatedUsers = filteredUsers.slice(
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
        <span>Error al cargar los usuarios: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Listado de Usuarios
          </h3>
          <p className="text-xs text-muted-foreground">
            Consulta el rol, la comunidad asignada y el estado de cada cuenta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs"
          >
            <option value="all">Todos los roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="community_admin">Admin Comunidad</option>
            <option value="resident">Residente</option>
            <option value="guard">Guardia</option>
          </select>

          <select
            value={communityFilter}
            onChange={(e) => setCommunityFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs"
          >
            <option value="all">Todas las comunidades</option>
            <option value="none">Sin comunidad / Global</option>
            {communityOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="w-full sm:w-64">
            <SearchComponent
              filterText={filterText}
              setFilterText={setFilterText}
              isLoading={isLoading}
              placeholder="Buscar por nombre, correo o comunidad..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Comunidad</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  communityName={resolveCommunityName(user)}
                  actions={
                    <UserActions
                      user={user}
                      onEdit={() => onEdit?.(user)}
                      onToggleStatus={() => onToggleStatus?.(user)}
                      onResetPassword={() => onResetPassword?.(user)}
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
