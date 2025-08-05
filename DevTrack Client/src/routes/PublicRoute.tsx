import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { getDashboardRouteForRole } from "@/helper";
import { PageLoader } from "@/components/common";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isInitialized, isInitializing } = useSelector(
    (state: RootState) => state.auth
  );

  // Show loading while initializing
  if (!isInitialized || isInitializing) {
    return <PageLoader />;
  }

  // Redirect to role-based dashboard if user is already authenticated
  if (isAuthenticated === true && user && user.role) {
    const dashboardRoute = getDashboardRouteForRole(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // Allow access to public routes when not authenticated
  return children;
};

export default PublicRoute;
