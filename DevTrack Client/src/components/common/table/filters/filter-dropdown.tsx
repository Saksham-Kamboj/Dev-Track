import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFilterDropdownController } from "../controllers"
import { TABLE_TEXTS } from "@/constants"
import type { FilterDropdownProps, FilterOption } from "@/types"

export function FilterDropdown({
  controller: externalController,
  title,
  options,
  // Legacy props
  icon,
  selectedValues: legacySelectedValues = [],
  onSelectionChange: legacyOnSelectionChange,
  onClearFilters: _legacyOnClearFilters, // Unused - handled by controller
  config,
  className,
}: FilterDropdownProps) {
  // Create internal controller if not provided, but use external selected values
  const internalController = useFilterDropdownController({
    options,
    selectedValues: legacySelectedValues, // Use Redux values directly
    title,
    config,
    onSelectionChange: legacyOnSelectionChange,
    useExternalState: true, // Flag to indicate we should use external state
  })

  // Use external controller if provided, otherwise use internal
  const controller = externalController || internalController
  const { getters, handlers } = controller

  // Extract values from controller
  const { selectedValues, selectedCount, displayText: _displayText, filteredOptions } = getters // displayText unused in this component
  const { onToggleOption, onClearAll } = handlers

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 hover:bg-muted/50 border rounded text-muted-foreground",
            className
          )}
        >
          {icon}
          <span className="ml-1">{title}</span>
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[200px] bg-popover/95 backdrop-blur-sm border-border/50"
      >
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            {title}
          </div>
          <div className="space-y-1">
            {filteredOptions.map((option: FilterOption) => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent/50 transition-colors",
                    isSelected && "bg-accent/30"
                  )}
                  onClick={() => onToggleOption(option.value)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleOption(option.value)}
                    />
                    <span className="select-none">{option.label}</span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {option.count}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {selectedCount > 0 && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="w-full h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                {TABLE_TEXTS.FILTER.CLEAR_FILTERS}
              </Button>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
