"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { VisitResponse } from "@/schemas/visit-schema";

interface VisitDetailActionProps {
  visit: VisitResponse;
  onViewDetail: (visit: VisitResponse) => void;
}

export const VisitDetailAction = ({
  visit,
  onViewDetail,
}: VisitDetailActionProps) => {
  return (
    <div className="flex items-center justify-end">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 px-2.5 gap-1.5 text-primary hover:bg-primary/10 cursor-pointer"
        onClick={() => onViewDetail(visit)}
        title="Ver detalle de la visita"
      >
        <Eye className="h-4 w-4" />
        <span className="text-xs">Ver detalle</span>
      </Button>
    </div>
  );
};
