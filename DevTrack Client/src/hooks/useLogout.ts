import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '@/redux/hooks';
import { logoutUser } from '@/redux/slices';
import { PAGE_ROUTES, MESSAGES } from '@/constants';

/**
 * Custom hook for handling logout functionality
 * Provides a unified logout method that handles Redux state, navigation, and notifications
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = useCallback(async (message?: string) => {
    try {
      // Dispatch logout action
      const result = await dispatch(logoutUser({ message }));

      if (logoutUser.fulfilled.match(result)) {
        // Show message if provided
        if (message) {
          toast.error(message, {
            position: 'top-center',
            duration: 5000,
          });
        } else {
          toast.success(MESSAGES.SUCCESS.LOGOUT_SUCCESS, {
            position: 'top-center',
            duration: 3000,
          });
        }

        // Navigate to login page
        navigate(PAGE_ROUTES.AUTH.LOGIN, { replace: true });
      } else if (logoutUser.rejected.match(result)) {
        toast.error(result.payload || MESSAGES.ERROR.LOGOUT_FAILED, {
          position: 'top-center',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(MESSAGES.ERROR.LOGOUT_FAILED, {
        position: 'top-center',
        duration: 5000,
      });
    }
  }, [dispatch, navigate]);

  return { logout };
};
