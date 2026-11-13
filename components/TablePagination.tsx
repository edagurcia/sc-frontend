import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaginationStore } from "@/stores";

interface TablePaginationProps {
  entityKey: string;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}

const DEFAULT_OPTIONS = [10, 20, 50, 100];

export const TablePagination = ({
  entityKey,
  totalPages,
  totalItems,
  isLoading = false,
  pageSizeOptions = DEFAULT_OPTIONS,
  showPageSizeSelector = true,
}: TablePaginationProps) => {
  const currentPage = usePaginationStore(
    (state) => state.pages[entityKey] ?? 1,
  );
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );

  const setPage = usePaginationStore((state) => state.setPage);
  const setPageSize = usePaginationStore((state) => state.setPageSize);

  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2 border-t border-neutral-200 dark:border-neutral-400">
      <div className="text-xs text-muted-foreground">
        Mostrando {startItem} a {endItem} de {totalItems} registros
      </div>

      <div className="flex items-center gap-6 lg:gap-8">
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <p className="text-xs">Registros por página</p>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(entityKey, Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-18 text-xs">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex w-25 items-center justify-center text-xs">
          Página {currentPage} de {totalPages || 1}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(entityKey, 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(entityKey, currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(entityKey, currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(entityKey, totalPages)}
            disabled={currentPage >= totalPages || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
