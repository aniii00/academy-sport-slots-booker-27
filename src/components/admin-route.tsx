
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { profile, isLoading } = useAuth();
  const location = useLocation();
  
  // Check if the user's role is admin
  const isAdmin = profile?.role === 'admin';

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sports-blue"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // Show a toast message when access is denied
    toast.error("You don't have admin access");
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
