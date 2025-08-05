import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { PAGE_ROUTES } from "@/constants";
import { PageLoader } from "@/components/common";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized, isInitializing } = useSelector(
    (state: RootState) => state.auth
  );

  // Show loading while initializing
  if (!isInitialized || isInitializing) {
    return <PageLoader />;
  }

  // Redirect to login if user is not authenticated
  if (isAuthenticated === false) {
    return <Navigate to={PAGE_ROUTES.AUTH.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
