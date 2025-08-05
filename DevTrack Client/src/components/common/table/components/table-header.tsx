import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { FilterDropdown } from "../filters/filter-dropdown"
import { Button } from "@/components/ui/button"
import { FilterChips } from "../filters"
import { useTableHeaderController } from "../controllers"
import { TABLE_TEXTS } from "@/constants"
import type { TableHeaderProps } from "@/types"

export function TableHeader({
  controller: externalController,
  // Legacy props
  searchQuery: legacySearchQuery,
  onSearchChange: legacyOnSearchChange,
  showSearch: legacyShowSearch = true,
  showStatusFilter: legacyShowStatusFilter = false,
  showPriorityFilter: legacyShowPriorityFilter = false,
  showRoleFilter: legacyShowRoleFilter = false,
  showUserStatusFilter: legacyShowUserStatusFilter = false,
  statusOptions = [],
  priorityOptions = [],
  roleOptions = [],
  userStatusOptions = [],
  selectedStatuses: legacySelectedStatuses = [],
  selectedPriorities: legacySelectedPriorities = [],
  selectedRoles: legacySelectedRoles = [],
  selectedUserStatuses: legacySelectedUserStatuses = [],
  onStatusFilter: legacyOnStatusFilter,
  onPriorityFilter: legacyOnPriorityFilter,
  onRoleFilter: legacyOnRoleFilter,
  onUserStatusFilter: legacyOnUserStatusFilter,
  onResetFilters: legacyOnResetFilters,
  hasActiveFilters: _legacyHasActiveFilters = false, // Unused - calculated by controller
  config,
  className,
}: TableHeaderProps) {
  // Create internal controller if not provided
  const internalController = useTableHeaderController({
    initialState: {
      searchQuery: legacySearchQuery || '',
      selectedStatuses: legacySelectedStatuses,
      selectedPriorities: legacySelectedPriorities,
      selectedRoles: legacySelectedRoles,
      selectedUserStatuses: legacySelectedUserStatuses,
    },
    config: {
      showSearch: legacyShowSearch,
      showStatusFilter: legacyShowStatusFilter,
      showPriorityFilter: legacyShowPriorityFilter,
      showRoleFilter: legacyShowRoleFilter,
      showUserStatusFilter: legacyShowUserStatusFilter,
      ...config,
    },
    // Pass external selected values (from Redux) to override internal state
    externalSelectedStatuses: legacySelectedStatuses,
    externalSelectedPriorities: legacySelectedPriorities,
    externalSelectedRoles: legacySelectedRoles,
    externalSelectedUserStatuses: legacySelectedUserStatuses,
    // Event handlers
    onSearchChange: legacyOnSearchChange,
    onStatusFilter: legacyOnStatusFilter,
    onPriorityFilter: legacyOnPriorityFilter,
    onRoleFilter: legacyOnRoleFilter,
    onUserStatusFilter: legacyOnUserStatusFilter,
    onResetFilters: legacyOnResetFilters, // Pass external reset handler
  })

  // Use external controller if provided, otherwise use internal
  const controller = externalController || internalController
  const { getters, handlers, config: finalConfig } = controller

  // Extract values from controller
  const {
    searchQuery,
    selectedStatuses,
    selectedPriorities,
    selectedRoles,
    selectedUserStatuses,
    hasActiveFilters,
  } = getters

  const {
    onSearchChange,
    onStatusFilter,
    onPriorityFilter,
    onRoleFilter,
    onUserStatusFilter,
    onResetFilters,
  } = handlers
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {finalConfig.showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={finalConfig.searchPlaceholder || TABLE_TEXTS.SEARCH.PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-[280px] bg-background/50 border-border focus:border-border h-8 rounded"
          />
        </div>
      )}

      {(finalConfig.showStatusFilter || finalConfig.showPriorityFilter || finalConfig.showRoleFilter || finalConfig.showUserStatusFilter) && (
        <div className="flex items-center space-x-3">
          {finalConfig.showStatusFilter && onStatusFilter && (
            <div className="flex items-center">
              <FilterDropdown
                title="Status"
                icon={<div className="h-3 w-3 rounded-full bg-blue-500" />}
                options={statusOptions}
                selectedValues={selectedStatuses}
                onSelectionChange={onStatusFilter}
              />
              {selectedStatuses.length > 0 && (
                <FilterChips
                  options={statusOptions}
                  selectedValues={selectedStatuses}
                />
              )}
            </div>
          )}

          {finalConfig.showPriorityFilter && onPriorityFilter && (
            <div className="flex items-center">
              <FilterDropdown
                title="Priority"
                icon={<div className="h-3 w-3 text-orange-500">↑</div>}
                options={priorityOptions}
                selectedValues={selectedPriorities}
                onSelectionChange={onPriorityFilter}
              />
              {selectedPriorities.length > 0 && (
                <FilterChips
                  options={priorityOptions}
                  selectedValues={selectedPriorities}
                />
              )}
            </div>
          )}

          {finalConfig.showRoleFilter && onRoleFilter && (
            <div className="flex items-center">
              <FilterDropdown
                title="Role"
                icon={<div className="h-3 w-3 rounded-full bg-purple-500" />}
                options={roleOptions}
                selectedValues={selectedRoles}
                onSelectionChange={onRoleFilter}
              />
              {selectedRoles.length > 0 && (
                <FilterChips
                  options={roleOptions}
                  selectedValues={selectedRoles}
                />
              )}
            </div>
          )}

          {finalConfig.showUserStatusFilter && onUserStatusFilter && (
            <div className="flex items-center">
              <FilterDropdown
                title="Status"
                icon={<div className="h-3 w-3 rounded-full bg-green-500" />}
                options={userStatusOptions}
                selectedValues={selectedUserStatuses}
                onSelectionChange={onUserStatusFilter}
              />
              {selectedUserStatuses.length > 0 && (
                <FilterChips
                  options={userStatusOptions}
                  selectedValues={selectedUserStatuses}
                />
              )}
            </div>
          )}

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground rounded"
            >
              Reset <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
