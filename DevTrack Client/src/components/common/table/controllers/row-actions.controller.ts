import { useState, useCallback, useMemo } from 'react'
import type { TableData, RowAction, UseRowActionsControllerProps, RowActionsConfig, RowActionsController, RowActionsGetters, RowActionsHandlers } from '@/types'

export function useRowActionsController<T extends TableData>({
  row,
  customActions = [],
  config = {},
  onEdit: externalOnEdit,
  onDuplicate: externalOnDuplicate,
  onDelete: externalOnDelete,
  onView: externalOnView,
  onDownload: externalOnDownload,
  onCustomAction: externalOnCustomAction,
}: UseRowActionsControllerProps<T>): RowActionsController {
  // Configuration with defaults
  const finalConfig: RowActionsConfig = {
    showEdit: true,
    showDuplicate: true,
    showDelete: true,
    showCustomActions: true,
    confirmDelete: true,
    deleteConfirmMessage: 'Are you sure you want to delete this item?',
    ...config,
  }

  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  // Computed getters
  const getters = useMemo((): RowActionsGetters => {
    const defaultActions: RowAction[] = []

    // Add default actions based on config and available handlers
    if (finalConfig.showEdit && externalOnEdit) {
      defaultActions.push({
        label: 'Edit',
        onClick: () => externalOnEdit(row),
      })
    }

    if (finalConfig.showDuplicate && externalOnDuplicate) {
      defaultActions.push({
        label: 'Duplicate',
        onClick: () => externalOnDuplicate(row),
      })
    }

    if (finalConfig.showDelete && externalOnDelete) {
      defaultActions.push({
        label: 'Delete',
        onClick: () => externalOnDelete(row),
        variant: 'destructive',
      })
    }

    // Add view action if handler is provided
    if (externalOnView) {
      defaultActions.push({
        label: 'View',
        onClick: () => externalOnView(row),
      })
    }

    // Add download action if handler is provided
    if (externalOnDownload) {
      defaultActions.push({
        label: 'Download',
        onClick: () => externalOnDownload(row),
      })
    }

    // Add custom actions if enabled
    const availableActions = finalConfig.showCustomActions
      ? [...defaultActions, ...customActions]
      : defaultActions

    const hasActions = availableActions.length > 0
    const canEdit = Boolean(finalConfig.showEdit && externalOnEdit)
    const canDuplicate = Boolean(finalConfig.showDuplicate && externalOnDuplicate)
    const canDelete = Boolean(finalConfig.showDelete && externalOnDelete)

    return {
      isOpen,
      isConfirmingDelete,
      selectedAction,
      availableActions,
      hasActions,
      canEdit,
      canDuplicate,
      canDelete,
    }
  }, [
    isOpen,
    isConfirmingDelete,
    selectedAction,
    customActions,
    finalConfig,
    externalOnEdit,
    externalOnDuplicate,
    externalOnDelete,
    externalOnView,
    externalOnDownload,
    row,
  ])

  // Event handlers
  const handleToggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSelectedAction(null)
  }, [])

  const handleEdit = useCallback(() => {
    if (externalOnEdit) {
      externalOnEdit(row)
      handleClose()
    }
  }, [externalOnEdit, row, handleClose])

  const handleDuplicate = useCallback(() => {
    if (externalOnDuplicate) {
      externalOnDuplicate(row)
      handleClose()
    }
  }, [externalOnDuplicate, row, handleClose])

  const handleDelete = useCallback(() => {
    if (finalConfig.confirmDelete) {
      setIsConfirmingDelete(true)
      setSelectedAction('delete')
    } else {
      if (externalOnDelete) {
        externalOnDelete(row)
        handleClose()
      }
    }
  }, [finalConfig.confirmDelete, externalOnDelete, row, handleClose])

  const handleView = useCallback(() => {
    if (externalOnView) {
      externalOnView(row)
      handleClose()
    }
  }, [externalOnView, row, handleClose])

  const handleDownload = useCallback(() => {
    if (externalOnDownload) {
      externalOnDownload(row)
      handleClose()
    }
  }, [externalOnDownload, row, handleClose])

  const handleConfirmDelete = useCallback(() => {
    if (externalOnDelete) {
      externalOnDelete(row)
    }
    setIsConfirmingDelete(false)
    setSelectedAction(null)
    handleClose()
  }, [externalOnDelete, row, handleClose])

  const handleCancelDelete = useCallback(() => {
    setIsConfirmingDelete(false)
    setSelectedAction(null)
  }, [])

  const handleCustomAction = useCallback((action: RowAction) => {
    if (externalOnCustomAction) {
      externalOnCustomAction(action, row)
    } else if (action.onClick) {
      action.onClick()
    }
    handleClose()
  }, [externalOnCustomAction, row, handleClose])

  const handleActionClick = useCallback((action: RowAction) => {
    setSelectedAction(action.label)

    // Handle built-in actions
    switch (action.label.toLowerCase()) {
      case 'edit':
        handleEdit()
        break
      case 'duplicate':
        handleDuplicate()
        break
      case 'delete':
        handleDelete()
        break
      case 'view':
        handleView()
        break
      case 'download':
        handleDownload()
        break
      default:
        handleCustomAction(action)
        break
    }
  }, [handleEdit, handleDuplicate, handleDelete, handleView, handleDownload, handleCustomAction])

  const handlers: RowActionsHandlers = {
    onToggleOpen: handleToggleOpen,
    onClose: handleClose,
    onEdit: handleEdit,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onConfirmDelete: handleConfirmDelete,
    onCancelDelete: handleCancelDelete,
    onCustomAction: handleCustomAction,
    onActionClick: handleActionClick,
  }

  return {
    getters,
    handlers,
    config: finalConfig,
  }
}
