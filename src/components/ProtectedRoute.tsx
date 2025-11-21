import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, initializing } = useAdminAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Verificando acesso...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname, message: "Você precisa de acesso administrativo para continuar." }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
