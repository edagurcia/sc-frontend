"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Power, KeyRound, Building2, Shield } from "lucide-react";
import { User, UserRole } from "@/schemas/user-schema";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  community_admin: "Admin Comunidad",
  resident: "Residente",
  guard: "Guardia",
};

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export const UserActions = ({
  user,
  onEdit,
  onToggleStatus,
  onResetPassword,
}: UserActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
        onClick={() => onResetPassword(user)}
        title="Restablecer contraseña de usuario"
      >
        <KeyRound className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-500/10 cursor-pointer"
        onClick={() => onEdit(user)}
        title="Editar usuario"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 cursor-pointer ${
          user.isActive
            ? "text-amber-600 hover:bg-amber-500/10"
            : "text-emerald-600 hover:bg-emerald-500/10"
        }`}
        onClick={() => onToggleStatus(user)}
        title={user.isActive ? "Desactivar usuario" : "Activar usuario"}
      >
        <Power className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface UserRowProps {
  user: User;
  communityName: string;
  actions: React.ReactNode;
}

export const UserRow = ({ user, communityName, actions }: UserRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium text-foreground">{user.name}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
      </TableCell>

      <TableCell>
        <Badge variant="secondary" className="gap-1 font-normal">
          <Shield className="h-3 w-3 text-teal-600" />
          {ROLE_LABELS[user.role] ?? user.role}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="inline-flex items-center gap-1.5 text-xs">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground">{communityName}</span>
        </div>
        {user.communityId && (
          <div className="text-[11px] font-mono text-muted-foreground">
            {user.communityId}
          </div>
        )}
      </TableCell>

      <TableCell className="text-center">
        <Badge variant={user.isActive ? "default" : "outline"}>
          {user.isActive ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>

      <TableCell className="text-right">{actions}</TableCell>
    </TableRow>
  );
};
