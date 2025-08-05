import { useState, useCallback, useMemo } from 'react'
import { TABLE_TEXTS } from '@/constants'
import type { TableData, TableToolbarConfig, TableToolbarController, TableToolbarGetters, TableToolbarHandlers, UseTableToolbarControllerProps } from '@/types'


export function useTableToolbarController<T extends TableData>({
  columns,
  initialColumnVisibility = {},
  columnVisibility: externalColumnVisibility,
  selectedRowsCount = 0,
  config = {},
  onColumnVisibilityChange: externalOnColumnVisibilityChange,
  onAddClick: externalOnAddClick,
  onBulkDelete: externalOnBulkDelete,
  onBulkAction: externalOnBulkAction,
}: UseTableToolbarControllerProps<T>): TableToolbarController<T> {
  // Configuration with defaults
  const finalConfig: TableToolbarConfig = {
    showAddButton: true,
    showColumnVisibility: true,
    showBulkActions: false,
    addButtonText: TABLE_TEXTS.TOOLBAR.ADD_ITEM,
    excludeColumnsFromToggle: ['id', 'userId', 'taskId'], // Common ID columns
    ...config,
  }

  // Initialize column visibility state
  const getInitialColumnVisibility = useCallback(() => {
    const visibility: Record<string, boolean> = {}
    columns.forEach(column => {
      visibility[column.key] = initialColumnVisibility[column.key] ?? true
    })
    return visibility
  }, [columns, initialColumnVisibility])

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(getInitialColumnVisibility)

  // Use external column visibility if provided, otherwise use internal state
  const currentColumnVisibility = externalColumnVisibility || columnVisibility

  // Computed getters
  const getters = useMemo((): TableToolbarGetters<T> => {
    const visibleColumns = columns.filter(column => currentColumnVisibility[column.key] !== false)
    const hiddenColumns = columns.filter(column => currentColumnVisibility[column.key] === false)
    
    // Exclude certain columns from being toggleable (like ID columns)
    const toggleableColumns = columns.filter(column => 
      !finalConfig.excludeColumnsFromToggle?.includes(column.key)
    )
    
    const hasSelectedRows = selectedRowsCount > 0
    const allColumnsVisible = hiddenColumns.length === 0
    const someColumnsHidden = hiddenColumns.length > 0

    return {
      columns,
      columnVisibility: currentColumnVisibility,
      visibleColumns,
      hiddenColumns,
      toggleableColumns,
      selectedRowsCount,
      hasSelectedRows,
      allColumnsVisible,
      someColumnsHidden,
    }
  }, [columns, currentColumnVisibility, selectedRowsCount, finalConfig.excludeColumnsFromToggle])

  // Event handlers
  const handleColumnVisibilityChange = useCallback((columnKey: string) => {
    if (externalOnColumnVisibilityChange) {
      // Use external handler if provided (for Redux-based state)
      const currentVisibility = currentColumnVisibility[columnKey] ?? true
      externalOnColumnVisibilityChange(columnKey, !currentVisibility)
    } else {
      // Use internal state if no external handler
      setColumnVisibility(prev => {
        const newVisibility = { ...prev }
        const currentVisibility = newVisibility[columnKey] ?? true
        newVisibility[columnKey] = !currentVisibility
        return newVisibility
      })
    }
  }, [externalOnColumnVisibilityChange, currentColumnVisibility])

  const handleShowAllColumns = useCallback(() => {
    if (externalOnColumnVisibilityChange) {
      // Use external handler for each column
      columns.forEach(column => {
        if (currentColumnVisibility[column.key] === false) {
          externalOnColumnVisibilityChange(column.key, true)
        }
      })
    } else {
      // Use internal state
      const newVisibility: Record<string, boolean> = {}
      columns.forEach(column => {
        newVisibility[column.key] = true
      })
      setColumnVisibility(newVisibility)
    }
  }, [columns, currentColumnVisibility, externalOnColumnVisibilityChange])

  const handleHideAllColumns = useCallback(() => {
    if (externalOnColumnVisibilityChange) {
      // Use external handler for each column
      columns.forEach(column => {
        if (!finalConfig.excludeColumnsFromToggle?.includes(column.key)) {
          externalOnColumnVisibilityChange(column.key, false)
        }
      })
    } else {
      // Use internal state
      const newVisibility: Record<string, boolean> = {}
      columns.forEach(column => {
        // Don't hide excluded columns (like ID columns)
        if (finalConfig.excludeColumnsFromToggle?.includes(column.key)) {
          newVisibility[column.key] = true
        } else {
          newVisibility[column.key] = false
        }
      })
      setColumnVisibility(newVisibility)
    }
  }, [columns, finalConfig.excludeColumnsFromToggle, externalOnColumnVisibilityChange])

  const handleResetColumnVisibility = useCallback(() => {
    const resetVisibility = getInitialColumnVisibility()
    setColumnVisibility(resetVisibility)
    
    // Notify external handler for each column that changed
    columns.forEach(column => {
      const currentVisibility = columnVisibility[column.key] ?? true
      const resetVisibilityValue = resetVisibility[column.key] ?? true
      if (currentVisibility !== resetVisibilityValue) {
        externalOnColumnVisibilityChange?.(column.key, resetVisibilityValue)
      }
    })
  }, [columns, columnVisibility, getInitialColumnVisibility, externalOnColumnVisibilityChange])

  const handleAddClick = useCallback(() => {
    externalOnAddClick?.()
  }, [externalOnAddClick])

  const handleBulkDelete = useCallback(() => {
    externalOnBulkDelete?.()
  }, [externalOnBulkDelete])

  const handleBulkAction = useCallback((action: string) => {
    externalOnBulkAction?.(action)
  }, [externalOnBulkAction])

  const handlers: TableToolbarHandlers = {
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onShowAllColumns: handleShowAllColumns,
    onHideAllColumns: handleHideAllColumns,
    onResetColumnVisibility: handleResetColumnVisibility,
    onAddClick: finalConfig.showAddButton ? handleAddClick : undefined,
    onBulkDelete: finalConfig.showBulkActions ? handleBulkDelete : undefined,
    onBulkAction: finalConfig.showBulkActions ? handleBulkAction : undefined,
  }

  return {
    getters,
    handlers,
    config: finalConfig,
  }
}
