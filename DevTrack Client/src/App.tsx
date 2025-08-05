import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider";
import AppRoutes from "./routes/routes";
import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { initializeAuth } from "./redux/slices";
import { useAppDispatch } from "./redux/hooks";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppRoutes />
        <Toaster position="top-center" />
      </ThemeProvider>
    </Router>
  );
}

export default App;
