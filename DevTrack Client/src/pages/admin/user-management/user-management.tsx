import { DataTable } from "@/components/common/table"
import { useUserManagementController } from "./user-management.controller"
import { PAGE_TEXTS } from "@/constants"

const UserManagement = () => {
    // Use the user management controller following the established pattern
    const controller = useUserManagementController([], {
        title: PAGE_TEXTS.USER_MANAGEMENT.TITLE,
        description: PAGE_TEXTS.USER_MANAGEMENT.DESCRIPTION,
        showCheckboxes: true,
        pageSize: 10
    })

    const { getters, handlers } = controller

    return (
        <div className="space-y-3 mt-2">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{getters.title}</h1>
                <p className="text-muted-foreground">{getters.description}</p>
            </div>

            <DataTable
                data={getters.data}
                columns={getters.columns}
                config={{
                    showCheckboxes: false,
                    showPagination: true,
                    showSearch: true,
                    pageSize: getters.pageSize,
                }}
                onRowClick={handlers.onUserClick}
                showStatusFilter={false}
                showPriorityFilter={false}
                showRoleFilter={true}
                showUserStatusFilter={true}
                showActions={true}
                showSerialNumber={true}
                controller={controller}
                showAddButton={true}
                onAddClick={handlers.onAddUser}
                addButtonText="Add User"
                actions={{
                    edit: true,
                    onEdit: handlers.onUserEdit,
                    delete: true,
                    onDelete: handlers.onUserDelete,
                    view: true,
                    onView: handlers.onUserClick,
                }}
            />
        </div>
    )
}

export default UserManagement
