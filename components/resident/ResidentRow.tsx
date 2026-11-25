"use client";

import { ReactNode } from "react";
import { UserCheck, UserX } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Resident } from "@/schemas";
import { formatCurrency } from "@/utils/formatters";

interface ResidentRowProps {
  resident: Resident;
  actions?: ReactNode;
}

export const ResidentRow = ({ resident, actions }: ResidentRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-bold">
        {resident.houseNumber || "S/N"}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {resident.fullName}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {resident.dni}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>{resident.phone}</span>
          <span className="italic">{resident.email}</span>
        </div>
      </TableCell>
      <TableCell className="font-semibold text-foreground">
        {formatCurrency(resident.monthlyFee ?? 0)}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant={resident.isActive ? "default" : "secondary"}
          className="gap-1 text-[10px]"
        >
          {resident.isActive ? (
            <>
              <UserCheck className="h-3 w-3" /> Activo
            </>
          ) : (
            <>
              <UserX className="h-3 w-3" /> Inactivo
            </>
          )}
        </Badge>
      </TableCell>
      {actions && <TableCell className="text-right">{actions}</TableCell>}
    </TableRow>
  );
};
