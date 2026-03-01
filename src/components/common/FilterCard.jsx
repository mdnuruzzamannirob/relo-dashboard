import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => (
  <div className={cn("relative w-full", className)}>
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
    <Input
      placeholder={placeholder}
      className="pl-10 pr-8 h-10"
      value={value}
      onChange={onChange}
    />
    {value && (
      <button
        onClick={() => onChange({ target: { value: "" } })}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

export const FilterSelect = ({
  value,
  onChange,
  options = [],
  label = "Filter",
  className = "",
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={cn("h-10 w-full sm:w-40", className)}>
      <SelectValue placeholder={label} />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const FilterBar = ({ children, className = "" }) => (
  <div
    className={cn(
      "rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
      className,
    )}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  </div>
);

export const FilterCard = ({
  searchValue,
  onSearchChange,
  onClearSearch,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = "Filter",
  className = "",
}) => (
  <FilterBar className={className}>
    <div className="flex-1">
      <SearchBar
        value={searchValue}
        onChange={(e) => onSearchChange(e)}
        placeholder={searchPlaceholder}
      />
    </div>
    <FilterSelect
      value={filterValue}
      onChange={onFilterChange}
      options={filterOptions}
      label={filterLabel}
    />
  </FilterBar>
);
