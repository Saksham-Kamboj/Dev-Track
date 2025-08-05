import type { TableHeaderConfig, TableHeaderController, TableHeaderGetters, TableHeaderHandlers, UseTableHeaderControllerProps } from '@/types'
import { useState, useCallback, useMemo } from 'react'
import { TABLE_TEXTS } from '@/constants'

export function useTableHeaderController({
  initialState = {},
  config = {},
  // External selected values (from Redux)
  externalSelectedStatuses,
  externalSelectedPriorities,
  externalSelectedRoles,
  externalSelectedUserStatuses,
  // Event handlers
  onSearchChange: externalOnSearchChange,
  onStatusFilter: externalOnStatusFilter,
  onPriorityFilter: externalOnPriorityFilter,
  onRoleFilter: externalOnRoleFilter,
  onUserStatusFilter: externalOnUserStatusFilter,
  onResetFilters: externalOnResetFilters,
  onFiltersChange,
}: UseTableHeaderControllerProps = {}): TableHeaderController {
  // State management
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery || '')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialState.selectedStatuses || [])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(initialState.selectedPriorities || [])
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialState.selectedRoles || [])
  const [selectedUserStatuses, setSelectedUserStatuses] = useState<string[]>(initialState.selectedUserStatuses || [])

  // Configuration with defaults
  const finalConfig: TableHeaderConfig = {
    showSearch: true,
    showStatusFilter: false,
    showPriorityFilter: false,
    showRoleFilter: false,
    showUserStatusFilter: false,
    searchPlaceholder: TABLE_TEXTS.SEARCH.PLACEHOLDER,
    ...config,
  }

  // Computed getters
  const getters = useMemo((): TableHeaderGetters => {
    // Use external values when available (from Redux), fallback to internal state
    const currentSelectedStatuses = externalSelectedStatuses ?? selectedStatuses
    const currentSelectedPriorities = externalSelectedPriorities ?? selectedPriorities
    const currentSelectedRoles = externalSelectedRoles ?? selectedRoles
    const currentSelectedUserStatuses = externalSelectedUserStatuses ?? selectedUserStatuses

    const hasActiveSearch = searchQuery.trim().length > 0
    const hasActiveStatusFilter = currentSelectedStatuses.length > 0
    const hasActivePriorityFilter = currentSelectedPriorities.length > 0
    const hasActiveRoleFilter = currentSelectedRoles.length > 0
    const hasActiveUserStatusFilter = currentSelectedUserStatuses.length > 0

    const hasActiveFilters = hasActiveStatusFilter || hasActivePriorityFilter || hasActiveRoleFilter || hasActiveUserStatusFilter
    const totalActiveFilters = currentSelectedStatuses.length + currentSelectedPriorities.length + currentSelectedRoles.length + currentSelectedUserStatuses.length

    return {
      searchQuery,
      selectedStatuses: currentSelectedStatuses,
      selectedPriorities: currentSelectedPriorities,
      selectedRoles: currentSelectedRoles,
      selectedUserStatuses: currentSelectedUserStatuses,
      hasActiveFilters,
      hasActiveSearch,
      totalActiveFilters,
    }
  }, [
    searchQuery,
    selectedStatuses, selectedPriorities, selectedRoles, selectedUserStatuses,
    externalSelectedStatuses, externalSelectedPriorities, externalSelectedRoles, externalSelectedUserStatuses
  ])

  // Event handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    externalOnSearchChange?.(query)
    onFiltersChange?.({ searchQuery: query })
  }, [externalOnSearchChange, onFiltersChange])

  const handleStatusFilter = useCallback((values: string[]) => {
    setSelectedStatuses(values)
    externalOnStatusFilter?.(values)
    onFiltersChange?.({ selectedStatuses: values })
  }, [externalOnStatusFilter, onFiltersChange])

  const handlePriorityFilter = useCallback((values: string[]) => {
    setSelectedPriorities(values)
    externalOnPriorityFilter?.(values)
    onFiltersChange?.({ selectedPriorities: values })
  }, [externalOnPriorityFilter, onFiltersChange])

  const handleRoleFilter = useCallback((values: string[]) => {
    setSelectedRoles(values)
    externalOnRoleFilter?.(values)
    onFiltersChange?.({ selectedRoles: values })
  }, [externalOnRoleFilter, onFiltersChange])

  const handleUserStatusFilter = useCallback((values: string[]) => {
    setSelectedUserStatuses(values)
    externalOnUserStatusFilter?.(values)
    onFiltersChange?.({ selectedUserStatuses: values })
  }, [externalOnUserStatusFilter, onFiltersChange])

  const handleResetFilters = useCallback(() => {
    // If external reset handler is provided, use it (for Redux-based tables)
    if (externalOnResetFilters) {
      externalOnResetFilters()
      return
    }

    // Otherwise, handle reset internally (for local state tables)
    const resetState = {
      selectedStatuses: [],
      selectedPriorities: [],
      selectedRoles: [],
      selectedUserStatuses: [],
    }

    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedRoles([])
    setSelectedUserStatuses([])

    externalOnStatusFilter?.([])
    externalOnPriorityFilter?.([])
    externalOnRoleFilter?.([])
    externalOnUserStatusFilter?.([])
    onFiltersChange?.(resetState)
  }, [externalOnResetFilters, externalOnStatusFilter, externalOnPriorityFilter, externalOnRoleFilter, externalOnUserStatusFilter, onFiltersChange])

  const handleResetSearch = useCallback(() => {
    setSearchQuery('')
    externalOnSearchChange?.('')
    onFiltersChange?.({ searchQuery: '' })
  }, [externalOnSearchChange, onFiltersChange])

  const handleResetAll = useCallback(() => {
    // If external reset handler is provided, use it (for Redux-based tables)
    if (externalOnResetFilters) {
      externalOnResetFilters()
      return
    }

    // Otherwise, handle reset internally (for local state tables)
    const resetState = {
      searchQuery: '',
      selectedStatuses: [],
      selectedPriorities: [],
      selectedRoles: [],
      selectedUserStatuses: [],
    }

    setSearchQuery('')
    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedRoles([])
    setSelectedUserStatuses([])

    externalOnSearchChange?.('')
    externalOnStatusFilter?.([])
    externalOnPriorityFilter?.([])
    externalOnRoleFilter?.([])
    externalOnUserStatusFilter?.([])
    onFiltersChange?.(resetState)
  }, [externalOnResetFilters, externalOnSearchChange, externalOnStatusFilter, externalOnPriorityFilter, externalOnRoleFilter, externalOnUserStatusFilter, onFiltersChange])

  const handlers: TableHeaderHandlers = {
    onSearchChange: handleSearchChange,
    onStatusFilter: handleStatusFilter,
    onPriorityFilter: handlePriorityFilter,
    onRoleFilter: handleRoleFilter,
    onUserStatusFilter: handleUserStatusFilter,
    onResetFilters: handleResetFilters,
    onResetSearch: handleResetSearch,
    onResetAll: handleResetAll,
  }

  return {
    getters,
    handlers,
    config: finalConfig,
  }
}
