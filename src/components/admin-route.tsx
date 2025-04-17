import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { profile, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const hasShownToast = useRef(false);
  
  if (isLoading || (isAuthenticated && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sports-blue"></div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    if (!hasShownToast.current) {
      toast.error("You don't have admin access");
      hasShownToast.current = true;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  hasShownToast.current = false;

  return <>{children}</>;
}
