
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { profile, isLoading } = useAuth();
  const location = useLocation();
  const hasShownToast = useRef(false);
  
  // Debug the profile data to see what's happening
  console.log("AdminRoute - profile:", profile);
  console.log("AdminRoute - role:", profile?.role);
  console.log("AdminRoute - isLoading:", isLoading);
  
  // Show loading state while checking authentication or if profile isn't loaded yet
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sports-blue"></div>
      </div>
    );
  }

  // Once profile is loaded, check if role is admin
  if (profile.role !== 'admin') {
    // Only show toast once
    if (!hasShownToast.current) {
      toast.error("You don't have admin access");
      hasShownToast.current = true;
    }
    // Redirect to home if not an admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Reset toast flag when successfully entering admin route
  hasShownToast.current = false;

  return <>{children}</>;
}
