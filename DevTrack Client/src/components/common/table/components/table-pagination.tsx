import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useTablePaginationController } from "../controllers"
import { TABLE_TEXTS } from "@/constants"
import type { TablePaginationProps } from "@/types"

export function TablePagination({
  controller: externalController,
  // Legacy props
  currentPage: legacyCurrentPage = 1,
  totalPages: _legacyTotalPages = 1, // Unused - totalPages calculated by controller
  pageSize: legacyPageSize = 10,
  totalItems: legacyTotalItems = 0,
  selectedRowsCount: legacySelectedRowsCount = 0,
  onPageChange: legacyOnPageChange,
  onPageSizeChange: legacyOnPageSizeChange,
  config,
  className,
}: TablePaginationProps) {
  // Create internal controller if not provided
  // Note: We pass the current totalItems value, not just the initial value
  const internalController = useTablePaginationController({
    totalItems: legacyTotalItems, // This will be the current value, updated on each render
    selectedRowsCount: legacySelectedRowsCount,
    initialPage: legacyCurrentPage,
    initialPageSize: legacyPageSize,
    config,
    onPageChange: legacyOnPageChange,
    onPageSizeChange: legacyOnPageSizeChange,
  })

  // Use external controller if provided, otherwise use internal
  const controller = externalController || internalController
  const { getters, handlers, config: _finalConfig } = controller // config unused in this component

  // Extract values from controller
  const {
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    selectedRowsCount,
    startItem,
    endItem,
    hasItems,
    hasPreviousPage: _hasPreviousPage, // Unused - buttons use currentPage logic
    hasNextPage: _hasNextPage, // Unused - buttons use currentPage logic
    pageSizeOptions,
  } = getters

  const {
    onPageSizeChange,
    onPreviousPage,
    onNextPage,
  } = handlers

  return (
    <div className={`flex items-center justify-between px-2 ${className || ""}`}>
      {/* Left side - Row count and page size selector */}
      <div className="flex items-center space-x-4">
        {/* Row count display */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {hasItems ? (
              <>
                {TABLE_TEXTS.PAGINATION.SHOWING}{" "}
                <span className="font-medium text-foreground">{startItem}</span> {TABLE_TEXTS.PAGINATION.TO}{" "}
                <span className="font-medium text-foreground">{endItem}</span> {TABLE_TEXTS.PAGINATION.OF}{" "}
                <span className="font-medium text-foreground">{totalItems}</span> {TABLE_TEXTS.PAGINATION.ENTRIES}
                {selectedRowsCount > 0 && (
                  <span className="ml-2">
                    (<span className="font-medium text-foreground">{selectedRowsCount}</span> {TABLE_TEXTS.PAGINATION.SELECTED})
                  </span>
                )}
              </>
            ) : (
              TABLE_TEXTS.PAGINATION.NO_ENTRIES
            )}
          </span>
        </div>

        {/* Page size selector */}
        {hasItems && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{TABLE_TEXTS.PAGINATION.SHOW}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 bg-background/50 border-border/50 hover:bg-background/80"
                >
                  {pageSize}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover/95 backdrop-blur-sm border-border/50">
                {pageSizeOptions.map((size: number) => (
                  <DropdownMenuItem
                    key={size}
                    className={`text-sm cursor-pointer ${size === pageSize ? "bg-accent" : ""}`}
                    onClick={() => onPageSizeChange(size)}
                  >
                    {size} {TABLE_TEXTS.PAGINATION.PER_PAGE}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-muted-foreground">{TABLE_TEXTS.PAGINATION.PER_PAGE}</span>
          </div>
        )}
      </div>

      {/* Right side - Page navigation */}
      {hasItems && totalPages > 1 && (
        <div className="flex items-center space-x-6 select-none">
          <span className="text-sm text-muted-foreground">
            {TABLE_TEXTS.PAGINATION.PAGE}{" "}
            <span className="font-medium text-foreground">{currentPage}</span> {TABLE_TEXTS.PAGINATION.OF}{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className="h-8 px-3 bg-background/50 rounded border border-border disabled:opacity-50 hover:bg-background/80"
            >
              {TABLE_TEXTS.PAGINATION.PREVIOUS}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="h-8 px-3 bg-background/50 rounded border border-border disabled:opacity-50 hover:bg-background/80"
            >
              {TABLE_TEXTS.PAGINATION.NEXT}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
