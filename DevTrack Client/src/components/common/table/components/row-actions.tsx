import { MoreHorizontal, Edit, Copy, Trash2, Eye, Download, Share, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRowActionsController, } from "../controllers"
import type { TableData, RowAction, RowActionsConfig, CustomActionsConfig, SimplifiedActions } from "@/types"

// Simplified Row Actions Component
function SimplifiedRowActions<T extends TableData>({
  row,
  actions,
  className
}: {
  row: T;
  actions: SimplifiedActions<T>;
  className?: string
}) {
  // Helper function to get icon for action
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'edit':
        return <Edit className="h-4 w-4" />
      case 'duplicate':
        return <Copy className="h-4 w-4" />
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      case 'view':
        return <Eye className="h-4 w-4" />
      case 'download':
        return <Download className="h-4 w-4" />
      case 'share':
        return <Share className="h-4 w-4" />
      case 'archive':
        return <Archive className="h-4 w-4" />
      default:
        return null
    }
  }

  // Get enabled actions
  const enabledActions = Object.entries(actions)
    .filter(([_, action]) => action.enabled && action.handler)
    .map(([type, action]) => ({
      type,
      handler: action.handler!,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      icon: getActionIcon(type),
      variant: type === 'delete' || type === 'archive' ? 'destructive' as const : 'default' as const
    }))

  if (enabledActions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 hover:bg-muted/50 text-muted-foreground hover:text-foreground ${className || ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm border-border/50">
        {enabledActions.map((action) => (
          <DropdownMenuItem
            key={action.type}
            className={`text-sm ${action.variant === "destructive" ? "text-destructive" : ""}`}
            onClick={() => action.handler(row)}
          >
            <div className="flex items-center gap-2">
              {action.icon}
              <span>{action.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface RowActionsProps<T extends TableData> {
  // Controller-based props
  controller?: ReturnType<typeof useRowActionsController>

  // Required props
  row: T

  // Simplified actions (new approach)
  simplifiedActions?: SimplifiedActions<T>

  // Enhanced props for flexible actions (legacy)
  customActions?: CustomActionsConfig<T>
  visible?: boolean

  // Legacy props (for backward compatibility)
  actions?: RowAction[]
  onEdit?: (row: T) => void
  onDuplicate?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  onDownload?: (row: T) => void
  onCustomAction?: (action: RowAction, row: T) => void

  // Configuration
  config?: RowActionsConfig
  className?: string
}

export function RowActions<T extends TableData>({
  controller: externalController,
  row,
  // Simplified actions (new approach)
  simplifiedActions,
  // Enhanced props (legacy)
  customActions,
  visible = true,
  // Legacy props
  actions: legacyActions,
  onEdit: legacyOnEdit,
  onDuplicate: legacyOnDuplicate,
  onDelete: legacyOnDelete,
  onView: legacyOnView,
  onDownload: legacyOnDownload,
  onCustomAction: legacyOnCustomAction,
  config,
  className,
}: RowActionsProps<T>) {
  // Don't render if not visible
  if (!visible) {
    return null
  }

  // If using simplified actions, render them directly
  if (simplifiedActions) {
    return <SimplifiedRowActions row={row} actions={simplifiedActions} className={className} />
  }
  // Merge custom actions with legacy actions
  const mergedActions = [
    ...(customActions?.actions || []),
    ...(legacyActions || [])
  ]

  // Create internal controller if not provided
  const internalController = useRowActionsController({
    row,
    customActions: mergedActions,
    config: {
      ...config,
      showEdit: customActions?.showEdit ?? config?.showEdit ?? true,
      showDuplicate: customActions?.showDuplicate ?? config?.showDuplicate ?? true,
      showDelete: customActions?.showDelete ?? config?.showDelete ?? true,
      showView: customActions?.customActionHandlers?.onView ? true : false,
      showDownload: customActions?.customActionHandlers?.onDownload ? true : false,
    },
    onEdit: customActions?.customActionHandlers?.onEdit || legacyOnEdit,
    onDuplicate: customActions?.customActionHandlers?.onDuplicate || legacyOnDuplicate,
    onDelete: customActions?.customActionHandlers?.onDelete || legacyOnDelete,
    onView: customActions?.customActionHandlers?.onView || legacyOnView,
    onDownload: customActions?.customActionHandlers?.onDownload || legacyOnDownload,
    onCustomAction: legacyOnCustomAction,
  })

  // Use external controller if provided, otherwise use internal
  const controller = externalController || internalController
  const { getters, handlers } = controller

  // Extract values from controller
  const { availableActions, hasActions } = getters
  const { onActionClick } = handlers

  if (!hasActions) {
    return null
  }

  // Helper function to get icon for action
  const getActionIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'edit':
        return <Edit className="h-4 w-4" />
      case 'duplicate':
        return <Copy className="h-4 w-4" />
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      case 'view':
        return <Eye className="h-4 w-4" />
      case 'download':
        return <Download className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 hover:bg-muted/50 text-muted-foreground hover:text-foreground ${className || ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm border-border/50">
        {availableActions.map((action, index) => {
          // Don't render hidden actions
          if (action.hidden) return null

          return (
            <div key={index}>
              <DropdownMenuItem
                className={`text-sm ${action.variant === "destructive" ? "text-destructive" : ""}`}
                onClick={() => onActionClick(action)}
                disabled={action.disabled}
                title={action.tooltip}
              >
                <div className="flex items-center gap-2">
                  {action.icon ? <action.icon className="h-4 w-4" /> : getActionIcon(action.label)}
                  <span>{action.label}</span>
                  {action.shortcut && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {action.shortcut}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
              {action.separator && index < availableActions.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
