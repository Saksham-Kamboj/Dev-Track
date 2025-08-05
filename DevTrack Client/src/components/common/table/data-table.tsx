import { cn } from "@/lib/utils"
import { TableHeader } from "./components/table-header"
import { TableBodyComponent } from "./components/table-body"
import { TablePagination } from "./components/table-pagination"
import { TableToolbar } from "./components/table-toolbar"
import { useDataTableController } from "./controllers/data-table.controller"
import type { DataTableProps, TableData } from "@/types"

export function DataTable<T extends TableData>({
  data,
  columns,
  config = {},
  className,
  onRowClick,
  showStatusFilter = false,
  showPriorityFilter = false,
  showRoleFilter = false,
  showUserStatusFilter = false,
  showActions = true,
  showSerialNumber = true,
  controller: externalController,

  // New actions object approach
  actions,

  // Toolbar configuration
  showAddButton = false,
  onAddClick,
  addButtonText = "Add Item",
  toolbarConfig,

  // Individual action props (for backward compatibility)
  edit = false,
  onEdit,
  duplicate = false,
  onDuplicate,
  delete: deleteAction = false,
  onDelete,
  view = false,
  onView,
  download = false,
  onDownload,
  share = false,
  onShare,
  archive = false,
  onArchive,

  // Legacy props
  customActions,
  actionsColumnConfig,
}: DataTableProps<T>) {
  const {
    showCheckboxes = false,
    showPagination = true,
    showSearch = true,
    showActions: configShowActions = true,
    showSerialNumber: configShowSerialNumber = true,
    pageSize = 10,
  } = config

  // Use prop value or config value, with prop taking precedence
  const shouldShowActions = showActions && configShowActions
  const shouldShowSerialNumber = showSerialNumber && configShowSerialNumber

  // Create simplified actions configuration from props
  // Priority: actions object > individual props
  const finalEdit = actions?.edit ?? edit
  const finalOnEdit = actions?.onEdit ?? onEdit
  const finalDuplicate = actions?.duplicate ?? duplicate
  const finalOnDuplicate = actions?.onDuplicate ?? onDuplicate
  const finalDelete = actions?.delete ?? deleteAction
  const finalOnDelete = actions?.onDelete ?? onDelete
  const finalView = actions?.view ?? view
  const finalOnView = actions?.onView ?? onView
  const finalDownload = actions?.download ?? download
  const finalOnDownload = actions?.onDownload ?? onDownload
  const finalShare = actions?.share ?? share
  const finalOnShare = actions?.onShare ?? onShare
  const finalArchive = actions?.archive ?? archive
  const finalOnArchive = actions?.onArchive ?? onArchive

  const simplifiedActions = {
    edit: finalEdit && finalOnEdit ? { enabled: true, handler: finalOnEdit } : { enabled: false },
    duplicate: finalDuplicate && finalOnDuplicate ? { enabled: true, handler: finalOnDuplicate } : { enabled: false },
    delete: finalDelete && finalOnDelete ? { enabled: true, handler: finalOnDelete } : { enabled: false },
    view: finalView && finalOnView ? { enabled: true, handler: finalOnView } : { enabled: false },
    download: finalDownload && finalOnDownload ? { enabled: true, handler: finalOnDownload } : { enabled: false },
    share: finalShare && finalOnShare ? { enabled: true, handler: finalOnShare } : { enabled: false },
    archive: finalArchive && finalOnArchive ? { enabled: true, handler: finalOnArchive } : { enabled: false },
  }

  // Check if any actions are enabled
  const hasAnyActions = Object.values(simplifiedActions).some(action => action.enabled)

  // Determine final actions column configuration
  const finalActionsColumnConfig = {
    show: shouldShowActions && hasAnyActions && (actionsColumnConfig?.show ?? config.actionsColumn?.show ?? true),
    position: actionsColumnConfig?.position ?? config.actionsColumn?.position ?? 'end',
    width: actionsColumnConfig?.width ?? config.actionsColumn?.width ?? '80px',
    className: actionsColumnConfig?.className ?? config.actionsColumn?.className,
    customActions: customActions ?? config.actionsColumn?.customActions,
    simplifiedActions
  }

  // Use external controller if provided, otherwise create internal controller
  const internalController = useDataTableController(data, columns, {
    showCheckboxes,
    showPagination,
    showSearch,
    showStatusFilter,
    showPriorityFilter,
    pageSize,
    onRowClick,
    actionsColumn: finalActionsColumnConfig
  })

  const controller = externalController || internalController
  const { getters, handlers } = controller

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {/* Header with search and filters */}
      <div className="flex items-center justify-between">
        <TableHeader
          searchQuery={getters.searchQuery}
          onSearchChange={handlers.onSearchChange}
          showSearch={showSearch}
          showStatusFilter={showStatusFilter}
          showPriorityFilter={showPriorityFilter}
          showRoleFilter={showRoleFilter}
          showUserStatusFilter={showUserStatusFilter}
          statusOptions={getters.statusOptions}
          priorityOptions={getters.priorityOptions}
          roleOptions={'roleOptions' in getters ? getters.roleOptions : []}
          userStatusOptions={'userStatusOptions' in getters ? getters.userStatusOptions : []}
          selectedStatuses={getters.selectedStatuses}
          selectedPriorities={getters.selectedPriorities}
          selectedRoles={'selectedRoles' in getters ? getters.selectedRoles : []}
          selectedUserStatuses={'selectedUserStatuses' in getters ? getters.selectedUserStatuses : []}
          onStatusFilter={handlers.onStatusFilter}
          onPriorityFilter={handlers.onPriorityFilter}
          onRoleFilter={'onRoleFilter' in handlers ? handlers.onRoleFilter : undefined}
          onUserStatusFilter={'onUserStatusFilter' in handlers ? handlers.onUserStatusFilter : undefined}
          onResetFilters={handlers.onResetFilters}
          hasActiveFilters={getters.hasActiveFilters}
        />

        <TableToolbar
          columns={columns}
          columnVisibility={getters.columnVisibility}
          onColumnVisibilityChange={handlers.onColumnVisibilityChange}
          hasActiveFilters={getters.hasActiveFilters}
          onResetFilters={handlers.onResetFilters}
          showAddButton={showAddButton}
          onAddClick={onAddClick}
          addButtonText={addButtonText}
          config={toolbarConfig}
        />
      </div>

      {/* Table Container - Contained within parent */}
      <div className="w-full overflow-hidden">
        <TableBodyComponent
          key={`table-${getters.totalItems}-${getters.currentPage}-${JSON.stringify(getters.filters)}`}
          data={getters.data}
          visibleColumns={getters.visibleColumns}
          showCheckboxes={showCheckboxes}
          showActions={finalActionsColumnConfig.show}
          showSerialNumber={shouldShowSerialNumber}
          currentPage={getters.currentPage}
          pageSize={getters.pageSize}
          selectedRows={getters.selectedRows || []}
          actionsColumnConfig={finalActionsColumnConfig}
          onRowClick={handlers.onRowClick}
          onRowSelection={handlers.onRowSelection}
          onAllRowsSelection={handlers.onAllRowsSelection}
          onEdit={handlers.onEdit}
          onDuplicate={handlers.onDuplicate}
          onDelete={handlers.onDelete}
        />
      </div>

      {/* Pagination */}
      {showPagination && (
        <TablePagination
          currentPage={getters.currentPage}
          totalPages={getters.totalPages}
          pageSize={getters.pageSize}
          totalItems={getters.totalItems}
          selectedRowsCount={getters.selectedRows?.length || 0}
          onPageChange={handlers.onPageChange}
          onPageSizeChange={handlers.onPageSizeChange}
        />
      )}
    </div>
  )
}
