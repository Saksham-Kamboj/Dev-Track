import { cn } from "@/lib/utils"
import type { FilterChipsProps } from "@/types"

export function FilterChips({
  options,
  selectedValues,
  className,
}: FilterChipsProps) {
  if (selectedValues.length === 0) return null

  if (selectedValues.length <= 1) {
    // Show individual filter values in single box with vertical separators
    return (
      <div className={cn("text-sm text-muted-foreground font-medium border border-dashed rounded h-8 flex items-center px-2", className)}>
        {selectedValues.map((value, index) => {
          const option = options.find(opt => opt.value === value)
          const displayLabel = option?.label.replace(/^[↓→↑]\s*/, '') || value // Remove arrows

          return (
            <div key={value} className="flex items-center">
              <span>{displayLabel}</span>
              {index < selectedValues.length - 1 && (
                <div className="w-px bg-border h-4 mx-2" />
              )}
            </div>
          )
        })}
      </div>
    )
  } else {
    // Show count in single box
    return (
      <span className={cn("text-sm text-muted-foreground font-medium border border-dashed rounded h-8 flex items-center justify-center px-2", className)}>
        {selectedValues.length} selected
      </span>
    )
  }
}
