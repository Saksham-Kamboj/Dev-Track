import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { RowActions } from "./row-actions"
import { useResponsiveTable } from "@/hooks/use-responsive-table"
import type { TableBodyComponentProps, TableData } from "@/types"

export function TableBodyComponent<T extends TableData>({
  data,
  visibleColumns,
  showCheckboxes = false,
  showActions = true,
  showSerialNumber = true,
  currentPage = 1,
  pageSize = 10,
  selectedRows,
  onRowClick,
  onRowSelection,
  onAllRowsSelection,
  onEdit,
  onDuplicate,
  onDelete,
  className,
  actionsColumnConfig,
}: TableBodyComponentProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    observeContainer,
    getResponsiveGridTemplate,
    getResponsiveClasses
  } = useResponsiveTable()

  // Set up container observation for responsive behavior
  useEffect(() => {
    if (containerRef.current) {
      return observeContainer(containerRef.current)
    }
  }, [observeContainer])

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row)
    }
  }

  // Generate responsive grid template columns
  const gridTemplateColumns = getResponsiveGridTemplate(visibleColumns, showCheckboxes, showActions, showSerialNumber)
  const responsiveClasses = getResponsiveClasses()

  return (
    <div
      ref={containerRef}
      className={cn("rounded border border-border bg-background backdrop-blur-sm overflow-hidden w-full max-w-full", responsiveClasses.container, className)}
    >
      {/* Fixed Header */}
      <div className="bg-gray-100 dark:bg-muted/50 border-b border-border/30">
        <div
          className="grid items-center w-full max-w-full"
          style={{
            gridTemplateColumns
          }}
        >
          {showCheckboxes && (
            <div className={cn("flex items-center justify-center px-3 flex-shrink-0", responsiveClasses.header)}>
              <Checkbox
                checked={
                  data.length > 0 &&
                  data.every((row) => selectedRows.includes(row.id))
                }
                onCheckedChange={onAllRowsSelection}
              />
            </div>
          )}
          {showSerialNumber && (
            <div className={cn("text-muted-foreground font-medium flex items-center justify-center min-w-0", responsiveClasses.header, responsiveClasses.cell, responsiveClasses.text)}>
              <span className="truncate" title="Sr No">Sr No</span>
            </div>
          )}
          {visibleColumns?.map((column) => (
            <div
              key={column.key}
              className={cn(
                "text-muted-foreground font-medium flex items-center min-w-0",
                responsiveClasses.header,
                responsiveClasses.cell,
                responsiveClasses.text,
                column.className
              )}
            >
              <span className="truncate" title={column.title}>{column.title}</span>
            </div>
          ))}
          {showActions && (
            <div className={cn("px-3 flex-shrink-0 flex items-center justify-center", responsiveClasses.header)}>
              <span className={cn("text-muted-foreground font-medium", responsiveClasses.text)}>Actions</span>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="h-[435px] overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-border">
        <div className="w-full max-w-full">
          {data.map((row, index) => (
            <div
              key={row.id}
              className={cn(
                "grid items-center border-b border-border hover:bg-gray-100 dark:hover:bg-muted/50 cursor-pointer transition-all duration-150 min-h-[60px] w-full max-w-full",
                selectedRows.includes(row.id) && "bg-blue-500/10 border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/25",
                "group"
              )}
              style={{
                gridTemplateColumns
              }}
              onClick={() => handleRowClick(row)}
            >
              {showCheckboxes && (
                <div className="flex items-center justify-center px-3 flex-shrink-0">
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={() => onRowSelection?.(row.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              {showSerialNumber && (
                <div className={cn("min-w-0 table-grid-item flex items-center justify-center", responsiveClasses.cell)}>
                  <span className={cn("font-medium", responsiveClasses.text)} title={`${(currentPage - 1) * pageSize + index + 1}`}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </span>
                </div>
              )}
              {visibleColumns?.map((column) => (
                <div
                  key={column.key}
                  className={cn("min-w-0 table-grid-item", responsiveClasses.cell, column.className)}
                >
                  <div className="w-full min-w-0">
                    {column.render
                      ? column.render(row[column.key], row)
                      : <span className={cn("truncate block", responsiveClasses.text)} title={String(row[column.key] || "")}>
                        {String(row[column.key] || "")}
                      </span>}
                  </div>
                </div>
              ))}
              {showActions && actionsColumnConfig?.show !== false && (
                <div className="flex items-center justify-center px-3 flex-shrink-0">
                  <RowActions
                    row={row}
                    simplifiedActions={actionsColumnConfig?.simplifiedActions}
                    customActions={actionsColumnConfig?.customActions}
                    visible={actionsColumnConfig?.show ?? true}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    className={actionsColumnConfig?.className}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
