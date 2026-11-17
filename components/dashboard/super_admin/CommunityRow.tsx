"use client";

import { ReactNode } from "react";
import { Building2, CheckCircle2, XCircle, UserCog } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CommunityResponse } from "@/schemas/community-schema";

interface CommunityRowProps {
  community: CommunityResponse;
  actions?: ReactNode;
  onOpenResidents?: () => void;
}

export const CommunityRow = ({
  community,
  actions,
  onOpenResidents,
}: CommunityRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-bold flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <span className="font-medium text-foreground">{community.name}</span>
          <span className="block text-[11px] text-muted-foreground font-normal">
            Creada: {new Date(community.createdAt).toLocaleDateString("es-HN")}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {community.address}
          </span>
          <span>
            {community.municipality}, {community.department}
          </span>
        </div>
      </TableCell>

      <TableCell>
        {community.adminName || community.adminEmail ? (
          <div className="flex items-center gap-2 text-xs">
            <UserCog className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {community.adminName || "Sin nombre"}
              </span>
              {community.adminEmail && (
                <span className="text-[11px] text-muted-foreground">
                  {community.adminEmail}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs italic text-muted-foreground">
            Sin administrador
          </span>
        )}
      </TableCell>

      {/* Residentes interactivo */}
      <TableCell className="text-center">
        <button
          type="button"
          onClick={onOpenResidents}
          title="Ver listado de residentes"
          className="inline-flex items-center justify-center bg-muted px-2.5 py-1 rounded-md font-medium text-foreground text-xs hover:bg-primary/15 hover:text-primary transition-colors cursor-pointer"
        >
          👥 {community.residentsCount ?? 0}
        </button>
      </TableCell>

      <TableCell className="text-center">
        <Badge
          variant={community.isActive ? "default" : "secondary"}
          className="gap-1 text-[10px]"
        >
          {community.isActive ? (
            <>
              <CheckCircle2 className="h-3 w-3" /> Activa
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" /> Inactiva
            </>
          )}
        </Badge>
      </TableCell>

      {actions && <TableCell className="text-right">{actions}</TableCell>}
    </TableRow>
  );
};
