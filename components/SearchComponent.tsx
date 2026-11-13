import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  filterText: string;
  placeholder?: string;
  isLoading: boolean;
  setFilterText: (text: string) => void;
};

export const SearchComponent = ({
  filterText,
  placeholder = "Buscar en todos los registros...",
  isLoading,
  setFilterText,
}: Props) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
};
