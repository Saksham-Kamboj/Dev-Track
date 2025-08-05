import { ChevronDown, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { TABLE_TEXTS } from "@/constants"
import type { ColumnVisibilityProps, TableData } from "@/types"

export function ColumnVisibility<T extends TableData>({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
  excludeFromToggle = [],
  className,
}: ColumnVisibilityProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`bg-background/50 border-border h-8 rounded ${className || ""}`}
        >
          {TABLE_TEXTS.COLUMN_VISIBILITY.BUTTON_TEXT}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium">{TABLE_TEXTS.COLUMN_VISIBILITY.TOGGLE_COLUMNS}</div>
        <DropdownMenuSeparator />
        {columns.slice(1).map((column) => {
          const isVisible = columnVisibility[column.key] ?? true
          const isDisabled = excludeFromToggle.includes(column.key)
          return (
            <DropdownMenuCheckboxItem
              key={column.key}
              checked={isVisible}
              onCheckedChange={isDisabled ? undefined : () => onColumnVisibilityChange(column.key)}
              onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
              className={`capitalize ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-2">
                {isVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                {column.title}
              </div>
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
