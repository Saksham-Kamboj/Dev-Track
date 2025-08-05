import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PAGE_ROUTES } from "@/constants";
import Layout from "@/components/layout/Layout";
import { PageLoader, ContentLoader } from "@/components/common";
import { getDashboardRouteForRole } from "@/helper";
import { useAppSelector } from "@/redux/hooks";

// Import core components that are needed immediately
import NotFound from "@/pages/common/not-found";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Optimized lazy loading with better chunk names and preloading
const Login = lazy(() =>
  import(/* webpackChunkName: "auth-login" */ "@/pages/auth/login/login")
);

const SendOtp = lazy(() =>
  import(/* webpackChunkName: "auth-send-otp" */ "@/pages/auth/forget-password/send-otp/send-otp")
);

const VerifyOtp = lazy(() =>
  import(/* webpackChunkName: "auth-verify-otp" */ "@/pages/auth/forget-password/verify-otp/verify-otp")
);

const SetNewPassword = lazy(() =>
  import(/* webpackChunkName: "auth-set-password" */ "@/pages/auth/forget-password/set-new-password/set-new-password")
);

// Admin pages with role-based chunking
const AdminDashboard = lazy(() =>
  import(/* webpackChunkName: "admin-dashboard" */ "@/pages/admin/admin-dashboard/admin-dashboard")
);
const UserManagement = lazy(() =>
  import(/* webpackChunkName: "user-management" */ "@/pages/admin/user-management/user-management")
);
const AddUser = lazy(() =>
  import(/* webpackChunkName: "add-user" */ "@/pages/admin/user-management/add-user/add-user")
);
const EditUser = lazy(() =>
  import(/* webpackChunkName: "edit-user" */ "@/pages/admin/user-management/edit-user/edit-user")
);

// Developer pages with role-based chunking
const DeveloperDashboard = lazy(() =>
  import(/* webpackChunkName: "developer-dashboard" */ "@/pages/developer/developer-dashboard/developer-dashboard")
);

const TaskManagement = lazy(() =>
  import(/* webpackChunkName: "task-management" */ "@/pages/common/task-management/task-management")
);

const TaskCreate = lazy(() =>
  import(/* webpackChunkName: "task-create" */ "@/pages/common/task-create/task-create")
);

const TaskEdit = lazy(() =>
  import(/* webpackChunkName: "task-edit" */ "@/pages/common/task-edit/task-edit")
);

// Profile pages - shared across roles
const Profile = lazy(() =>
  import(/* webpackChunkName: "profile" */ "@/pages/common/profile/profile")
);

const EditProfile = lazy(() =>
  import(/* webpackChunkName: "profile-edit" */ "@/pages/common/edit-profile/edit-profile")
);

// Loading components are now imported from common folder

// Helper function to create public routes with optimized loading
const createPublicRoute = (Component: React.ComponentType) => (
  <PublicRoute>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </PublicRoute>
);

// Helper function to create private routes with optimized loading
const createProtectedRoute = (Component: React.ComponentType) => (
  <ProtectedRoute>
    <Layout>
      <Suspense fallback={<ContentLoader />}>
        <Component />
      </Suspense>
    </Layout>
  </ProtectedRoute>
);

// Common routes shared across multiple roles
const createCommonRoutes = () => [
  <Route
    key="not-found"
    path={PAGE_ROUTES.COMMON.NOT_FOUND}
    element={createProtectedRoute(NotFound)}
  />,

];

// Admin specific routes
const createAdminRoutes = () => [
  <Route
    key="admin-dashboard"
    path={PAGE_ROUTES.ADMIN.DASHBOARD}
    element={createProtectedRoute(AdminDashboard)}
  />,
  <Route
    key="user-management"
    path={PAGE_ROUTES.ADMIN.USER_MANAGEMENT}
    element={createProtectedRoute(UserManagement)}
  />,
  <Route
    key="add-user"
    path={PAGE_ROUTES.ADMIN.USER_MANAGEMENT_ADD_USER}
    element={createProtectedRoute(AddUser)}
  />,
  <Route
    key="edit-user"
    path={PAGE_ROUTES.ADMIN.USER_MANAGEMENT_EDIT_USER}
    element={createProtectedRoute(EditUser)}
  />,
  <Route
    key="admin-profile"
    path={PAGE_ROUTES.ADMIN.PROFILE}
    element={createProtectedRoute(Profile)}
  />,
  <Route
    key="admin-profile-edit"
    path={PAGE_ROUTES.ADMIN.EDIT_PROFILE}
    element={createProtectedRoute(EditProfile)}
  />,
  ...createCommonRoutes(),
];

// Developer specific routes
const createDeveloperRoutes = () => [
  <Route
    key="developer-dashboard"
    path={PAGE_ROUTES.DEVELOPER.DASHBOARD}
    element={createProtectedRoute(DeveloperDashboard)}
  />,
  <Route
    key="task-management"
    path={PAGE_ROUTES.DEVELOPER.TASK.ALL}
    element={createProtectedRoute(TaskManagement)}
  />,
  <Route
    key="task-create"
    path="/tasks/create"
    element={createProtectedRoute(TaskCreate)}
  />,
  <Route
    key="task-edit"
    path="/tasks/edit/:id"
    element={createProtectedRoute(TaskEdit)}
  />,
  <Route
    key="developer-profile"
    path={PAGE_ROUTES.DEVELOPER.PROFILE}
    element={createProtectedRoute(Profile)}
  />,
  <Route
    key="developer-profile-edit"
    path={PAGE_ROUTES.DEVELOPER.EDIT_PROFILE}
    element={createProtectedRoute(EditProfile)}
  />,
  // Common routes shared across all roles
  ...createCommonRoutes(),
];

const AppRoutes = () => {
  const { user, isAuthenticated, isInitialized, isInitializing } = useAppSelector((state) => state.auth);
  const role = user?.role?.toLowerCase() || "";
  const dashboardRoute = getDashboardRouteForRole(role);

  // Show loading while initializing auth state
  if (!isInitialized || isInitializing) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Root route: redirect to dashboard or login */}
      <Route
        path="/"
        element={
          isAuthenticated && user && role ? (
            <Navigate to={dashboardRoute} replace />
          ) : (
            <Navigate to={PAGE_ROUTES.AUTH.LOGIN} replace />
          )
        }
      />
      {/* Public & Auth Routes */}
      <Route
        path={PAGE_ROUTES.AUTH.LOGIN}
        element={createPublicRoute(Login)}
      />
      <Route
        path={PAGE_ROUTES.AUTH.SEND_OTP}
        element={createPublicRoute(SendOtp)}
      />
      <Route
        path={PAGE_ROUTES.AUTH.VERIFY_OTP}
        element={createPublicRoute(VerifyOtp)}
      />
      <Route
        path={PAGE_ROUTES.AUTH.SET_NEW_PASSWORD}
        element={createPublicRoute(SetNewPassword)}
      />
      {/* Role-based Protected Routes */}
      {role === "admin" && isAuthenticated ? (
        createAdminRoutes()
      ) : role === "developer" && isAuthenticated ? (
        createDeveloperRoutes()
      ) : (
        <Route
          path={PAGE_ROUTES.COMMON.NOT_FOUND}
          element={<Navigate to={PAGE_ROUTES.AUTH.LOGIN} replace />}
        />
      )}
    </Routes>
  );
};

export default AppRoutes;
