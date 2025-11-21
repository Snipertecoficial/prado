import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/admin-auth";

interface AdminGuardProps {
  children: JSX.Element;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminGuard;
