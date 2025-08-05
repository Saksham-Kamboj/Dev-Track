import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { TableColumn } from "@/types"
import type { UserData } from "@/types"
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "../../../types/admin/user-management.types"
import { formatLastLogin } from "@/utils/lastLogin.utils"



// Define table columns for users
export const userColumns: TableColumn<UserData>[] = [
  {
    key: "userId",
    title: "User ID",
    sortable: true,
    render: (value) => (
      <span className="font-medium text-foreground truncate block" title={value}>
        {value}
      </span>
    ),
  },
  {
    key: "name",
    title: "User",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center space-x-3 min-w-0">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={row.avatar} alt={row.name} />
          <AvatarFallback className="text-xs">
            {row?.name?.split(' ')?.map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-sm font-medium leading-none truncate" title={row.name}>
            {row.name}
          </p>
          <p className="text-xs text-muted-foreground truncate" title={row.email}>
            {row.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "phone",
    title: "Phone",
    sortable: true,
    render: (value) => (
      <span className="text-sm text-muted-foreground truncate block" title={value}>
        {value}
      </span>
    ),
  },
  {
    key: "role",
    title: "Role",
    sortable: true,
    render: (value) => {
      const roleOption = USER_ROLE_OPTIONS.find(option => option.value === value)
      return (
        <div className="flex justify-start min-w-0">
          <Badge
            variant={roleOption?.variant || "default"}
            className="badge-responsive"
            title={roleOption?.label || value}
          >
            {roleOption?.label || value}
          </Badge>
        </div>
      )
    },
  },
  {
    key: "status",
    title: "Status",
    sortable: true,
    render: (value) => {
      const statusOption = USER_STATUS_OPTIONS.find(option => option.value === value)
      return (
        <div className="flex justify-start min-w-0">
          <Badge
            variant={statusOption?.variant || "secondary"}
            className="badge-responsive"
            title={statusOption?.label || value}
          >
            {statusOption?.label || value}
          </Badge>
        </div>
      )
    },
  },
  {
    key: "joinDate",
    title: "Join Date",
    sortable: true,
    render: (value) => {
      const formattedDate = new Date(value).toLocaleDateString()
      return (
        <span className="text-sm text-muted-foreground truncate block" title={formattedDate}>
          {formattedDate}
        </span>
      )
    },
  },
  {
    key: "lastLogin",
    title: "Last Login",
    sortable: true,
    render: (value) => {
      const lastLoginInfo = formatLastLogin(value)

      return (
        <div className="flex items-center gap-2">
          {lastLoginInfo.isOnline && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
          <span
            className={`text-sm ${lastLoginInfo.colorClass} truncate block`}
            title={lastLoginInfo.tooltip}
          >
            {lastLoginInfo.displayText}
          </span>
        </div>
      )
    },
  },
]
