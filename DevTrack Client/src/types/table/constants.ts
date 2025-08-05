// Status and priority options
export const STATUS_OPTIONS = [
  { value: "In Progress", label: "In Progress", variant: "in-progress" as const },
  { value: "Backlog", label: "Backlog", variant: "backlog" as const },
  { value: "Todo", label: "Todo", variant: "todo" as const },
  { value: "Done", label: "Done", variant: "done" as const },
  { value: "Cancelled", label: "Cancelled", variant: "cancelled" as const },
] as const

export const PRIORITY_OPTIONS = [
  { value: "Low", label: "↓ Low", variant: "low" as const },
  { value: "Medium", label: "→ Medium", variant: "medium" as const },
  { value: "High", label: "↑ High", variant: "high" as const },
] as const

export const TYPE_OPTIONS = [
  { value: "Documentation", label: "Documentation" },
  { value: "Bug", label: "Bug" },
  { value: "Feature", label: "Feature" },
] as const
