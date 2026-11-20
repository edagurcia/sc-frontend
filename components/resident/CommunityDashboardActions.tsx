"use client";

import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { Resident } from "@/schemas";

interface Props {
  resident: Resident;
  onGeneratePayment: (resident: Resident) => void;
}

export const CommunityDashboardActions = ({
  resident,
  onGeneratePayment,
}: Props) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1 text-xs cursor-pointer bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30"
        onClick={() => onGeneratePayment(resident)}
        title="Generar Pago"
      >
        <DollarSign className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Cobrar</span>
      </Button>
    </div>
  );
};
