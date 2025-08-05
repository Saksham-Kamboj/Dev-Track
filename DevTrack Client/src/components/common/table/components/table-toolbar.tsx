import { Button } from "@/components/ui/button"
import type { TableData, TableToolbarProps } from "@/types"
import { ColumnVisibility } from "./column-visibility"
import { useTableToolbarController } from "../controllers"
import { TABLE_TEXTS } from "@/constants"

export function TableToolbar<T extends TableData>({
  controller: externalController,
  // Legacy props
  columns: legacyColumns = [],
  columnVisibility: legacyColumnVisibility = {},
  onColumnVisibilityChange: legacyOnColumnVisibilityChange,
  showAddButton: legacyShowAddButton = true,
  onAddClick: legacyOnAddClick,
  addButtonText: legacyAddButtonText = TABLE_TEXTS.TOOLBAR.ADD_TASK,
  selectedRowsCount: legacySelectedRowsCount = 0,
  config,
  className,
}: TableToolbarProps<T>) {
  // Create internal controller if not provided
  const internalController = useTableToolbarController({
    columns: legacyColumns,
    initialColumnVisibility: legacyColumnVisibility,
    columnVisibility: legacyColumnVisibility, // Pass external column visibility
    selectedRowsCount: legacySelectedRowsCount,
    config: {
      showAddButton: legacyShowAddButton,
      addButtonText: legacyAddButtonText,
      ...config,
    },
    onColumnVisibilityChange: legacyOnColumnVisibilityChange,
    onAddClick: legacyOnAddClick,
  })

  // Use external controller if provided, otherwise use internal
  const controller = externalController || internalController
  const { getters, handlers, config: finalConfig } = controller

  // Extract values from controller
  const { columns, columnVisibility } = getters
  const { onColumnVisibilityChange, onAddClick } = handlers

  // Use legacy columns or get all columns from controller
  const allColumns = legacyColumns.length > 0 ? legacyColumns : columns

  return (
    <div className={`flex items-center space-x-2 ${className || ""}`}>
      {finalConfig.showColumnVisibility && (
        <ColumnVisibility
          columns={allColumns}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
          excludeFromToggle={finalConfig.excludeColumnsFromToggle}
        />
      )}

      {finalConfig.showAddButton && onAddClick && (
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white h-8 rounded cursor-pointer"
          onClick={onAddClick}
        >
          {finalConfig.addButtonText}
        </Button>
      )}

      {finalConfig.showBulkActions && getters.hasSelectedRows && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {getters.selectedRowsCount} selected
          </span>
          {handlers.onBulkDelete && (
            <Button
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={handlers.onBulkDelete}
            >
              Delete Selected
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
