import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { PAGE_ROUTES } from "@/constants";

function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect to the main profile page since it includes editing functionality
    if (user?.role === "admin") {
      navigate(PAGE_ROUTES.ADMIN.PROFILE, { replace: true });
    } else if (user?.role === "developer") {
      navigate(PAGE_ROUTES.DEVELOPER.PROFILE, { replace: true });
    }
  }, [navigate, user?.role]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to profile...</p>
      </div>
    </div>
  );
}

export default EditProfile;
