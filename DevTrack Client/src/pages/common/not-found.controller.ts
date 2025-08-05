import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { getDashboardRouteForRole } from "@/helper";

interface INotFoundControllerResponse {
  getters: {
    role: string;
    dashboardRoute: string;
  };
  handlers: {
    handleGoHome: () => void;
    handleGoBack: () => void;
  };
}

export const useNotFoundController = (): INotFoundControllerResponse => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role?.toLowerCase() || "";
  const dashboardRoute = getDashboardRouteForRole(role);

  const handleGoHome = useCallback(() => {
    if (dashboardRoute) {
      navigate(dashboardRoute);
    } else {
      navigate("/");
    }
  }, [navigate, dashboardRoute]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    getters: {
      role,
      dashboardRoute,
    },
    handlers: {
      handleGoHome,
      handleGoBack,
    },
  };
};
