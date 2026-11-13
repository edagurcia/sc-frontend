import { usePaginationStore } from "@/stores";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  entityKey: string;
  isLoading: boolean;
  options: number[];
  className?: string;
};

const DEFAULT_OPTIONS = [10, 20, 50, 100];

export const PageSizeSelector = ({
  entityKey,
  isLoading = false,
  options = DEFAULT_OPTIONS,
  className = "w-60",
}: Props) => {
  const pageSize = usePaginationStore(
    (state) => state.pageSize[entityKey] ?? 10,
  );
  const setPageSize = usePaginationStore((state) => state.setPageSize);

  return (
    <Select
      value={pageSize.toString()}
      onValueChange={(value) => setPageSize(entityKey, Number(value))}
      disabled={isLoading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Registros por página" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option.toString()}>
            Mostrar {option} registros por página
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
