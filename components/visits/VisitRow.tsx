"use client";

import { ReactNode } from "react";
import {
  Repeat,
  Sparkles,
  CheckCircle2,
  XCircle,
  KeyRound,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VisitResponse } from "@/schemas/visit-schema";

interface VisitRowProps {
  visit: VisitResponse;
  actions?: ReactNode;
}

export const VisitRow = ({ visit, actions }: VisitRowProps) => {
  const displayName =
    visit.visitorName?.trim() || visit.companyName?.trim() || "Sin nombre";
  const secondaryLabel =
    visit.visitorName?.trim() && visit.companyName?.trim()
      ? visit.companyName
      : visit.vehiclePlate || visit.notes || "—";

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-foreground line-clamp-1">
            {displayName}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {secondaryLabel}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant={visit.isFrequent ? "default" : "secondary"}
          className="gap-1 text-[10px]"
        >
          {visit.isFrequent ? (
            <>
              <Repeat className="h-3 w-3" /> Frecuente
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" /> Casual
            </>
          )}
        </Badge>
      </TableCell>

      <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
        <span className="inline-flex items-center gap-1">
          <KeyRound className="h-3.5 w-3.5" />
          {visit.accessCode}
        </span>
      </TableCell>

      <TableCell className="text-center">
        <Badge
          variant={visit.isActive ? "default" : "secondary"}
          className="gap-1 text-[10px]"
        >
          {visit.isActive ? (
            <>
              <CheckCircle2 className="h-3 w-3" /> Activo
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" /> Revocado
            </>
          )}
        </Badge>
      </TableCell>

      {actions && <TableCell className="text-right">{actions}</TableCell>}
    </TableRow>
  );
};
