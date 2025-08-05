import { useState, useCallback, useMemo, useEffect } from 'react'
import type { FilterDropdownConfig, FilterDropdownController, FilterDropdownGetters, FilterDropdownHandlers, UseFilterDropdownControllerProps } from '@/types'

export function useFilterDropdownController({
  options,
  selectedValues: externalSelectedValues = [],
  title,
  config = {},
  onSelectionChange: externalOnSelectionChange,
  onOpen: externalOnOpen,
  onClose: externalOnClose,
  useExternalState = false,
}: UseFilterDropdownControllerProps): FilterDropdownController {
  // Configuration with defaults
  const finalConfig: FilterDropdownConfig = {
    multiSelect: true,
    showSelectAll: true,
    showClearAll: true,
    showSearch: false,
    maxDisplayItems: 3,
    closeOnSelect: false,
    ...config,
  }

  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Only use internal state if not using external state
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(
    useExternalState ? [] : externalSelectedValues
  )

  // When using external state, sync internal state (but don't use it for display)
  useEffect(() => {
    if (useExternalState) {
      setInternalSelectedValues(externalSelectedValues)
    }
  }, [externalSelectedValues, useExternalState])

  // Computed getters
  const getters = useMemo((): FilterDropdownGetters => {
    // Use external state when flag is true (Redux mode), otherwise use internal state
    const currentSelectedValues = useExternalState ? externalSelectedValues : internalSelectedValues

    const selectedCount = currentSelectedValues.length
    const hasSelection = selectedCount > 0

    // Filter options based on search query
    const filteredOptions = finalConfig.showSearch && searchQuery
      ? options.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options

    const selectedOptions = options.filter(option => currentSelectedValues.includes(option.value))
    const unselectedOptions = options.filter(option => !currentSelectedValues.includes(option.value))

    const allSelected = options.length > 0 && currentSelectedValues.length === options.length
    const noneSelected = currentSelectedValues.length === 0

    // Generate display text for the trigger button
    let displayText = title
    if (hasSelection) {
      if (selectedCount === 1) {
        const selectedOption = selectedOptions[0]
        displayText = selectedOption?.label || currentSelectedValues[0]
      } else if (selectedCount <= (finalConfig.maxDisplayItems || 3)) {
        displayText = selectedOptions.map(opt => opt.label).join(', ')
      } else {
        displayText = `${selectedCount} selected`
      }
    }

    return {
      isOpen,
      searchQuery,
      selectedValues: currentSelectedValues,
      selectedCount,
      hasSelection,
      filteredOptions,
      selectedOptions,
      unselectedOptions,
      allSelected,
      noneSelected,
      displayText,
    }
  }, [
    isOpen,
    searchQuery,
    internalSelectedValues,
    externalSelectedValues,
    useExternalState,
    options,
    title,
    finalConfig.showSearch,
    finalConfig.maxDisplayItems,
  ])

  // Event handlers
  const handleToggleOpen = useCallback(() => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    
    if (newIsOpen) {
      externalOnOpen?.()
    } else {
      externalOnClose?.()
    }
  }, [isOpen, externalOnOpen, externalOnClose])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    externalOnClose?.()
  }, [externalOnClose])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    externalOnOpen?.()
  }, [externalOnOpen])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleToggleOption = useCallback((value: string) => {
    // Use current selected values based on mode
    const currentSelectedValues = useExternalState ? externalSelectedValues : internalSelectedValues

    let newSelection: string[]

    if (finalConfig.multiSelect) {
      newSelection = currentSelectedValues.includes(value)
        ? currentSelectedValues.filter((v: string) => v !== value)
        : [...currentSelectedValues, value]
    } else {
      newSelection = currentSelectedValues.includes(value) ? [] : [value]
      if (!finalConfig.closeOnSelect) {
        handleClose()
      }
    }

    // Only update internal state if not using external state
    if (!useExternalState) {
      setInternalSelectedValues(newSelection)
    }

    // Always call external handler to update Redux/parent state
    externalOnSelectionChange?.(newSelection)

    if (finalConfig.closeOnSelect && !finalConfig.multiSelect) {
      handleClose()
    }
  }, [
    internalSelectedValues,
    externalSelectedValues,
    useExternalState,
    finalConfig.multiSelect,
    finalConfig.closeOnSelect,
    externalOnSelectionChange,
    handleClose,
  ])

  const handleSelectAll = useCallback(() => {
    const allValues = options.map(option => option.value)

    // Only update internal state if not using external state
    if (!useExternalState) {
      setInternalSelectedValues(allValues)
    }

    // Always call external handler to update Redux/parent state
    externalOnSelectionChange?.(allValues)
  }, [options, useExternalState, externalOnSelectionChange])

  const handleClearAll = useCallback(() => {
    // Only update internal state if not using external state
    if (!useExternalState) {
      setInternalSelectedValues([])
    }

    // Always call external handler to update Redux/parent state
    externalOnSelectionChange?.([])
  }, [useExternalState, externalOnSelectionChange])

  const handleSelectionChange = useCallback((values: string[]) => {
    // Only update internal state if not using external state
    if (!useExternalState) {
      setInternalSelectedValues(values)
    }

    // Always call external handler to update Redux/parent state
    externalOnSelectionChange?.(values)
  }, [useExternalState, externalOnSelectionChange])

  const handlers: FilterDropdownHandlers = {
    onToggleOpen: handleToggleOpen,
    onClose: handleClose,
    onOpen: handleOpen,
    onSearchChange: handleSearchChange,
    onToggleOption: handleToggleOption,
    onSelectAll: handleSelectAll,
    onClearAll: handleClearAll,
    onSelectionChange: handleSelectionChange,
  }

  return {
    getters,
    handlers,
    config: finalConfig,
  }
}
